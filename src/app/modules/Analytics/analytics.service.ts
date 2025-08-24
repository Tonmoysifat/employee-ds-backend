import { Request } from "express";
import { Shift } from "../Shifts/shift.model";

const coverage = async (req: Request) => {
  const date = new Date(String(req.query.date));
  const location = String(req.query.location || "");
  const pipeline: any[] = [
    { $match: { date, ...(location ? { location } : {}) } },
    {
      $group: {
        _id: "$roleRequired",
        requiredCount: { $sum: 1 },
        assignedCount: {
          $sum: { $cond: [{ $ifNull: ["$assignedEmployee", false] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        role: "$_id",
        requiredCount: 1,
        assignedCount: 1,
        gap: { $subtract: ["$requiredCount", "$assignedCount"] },
      },
    },
    { $sort: { role: 1 } },
  ];
  const data = await Shift.aggregate(pipeline);
  return { date, location, coverage: data };
};

const workload = async (req: Request) => {
  const employeeId = req.query.employeeId as string;
  const start = new Date(String(req.query.start));
  const end = new Date(String(req.query.end));

  const pipeline: any[] = [
    {
      $match: {
        assignedEmployee: { $exists: true, $ne: null },
        date: { $gte: start, $lte: end },
      },
    },
    {
      $match: {
        assignedEmployee: {
          $eq: new (require("mongoose").Types.ObjectId)(employeeId),
        },
      },
    },
    {
      $addFields: {
        startMin: {
          $add: [
            { $toInt: { $substr: ["$start", 0, 2] } },
            { $divide: [{ $toInt: { $substr: ["$start", 3, 2] } }, 60] },
          ],
        },
        endMin: {
          $add: [
            { $toInt: { $substr: ["$end", 0, 2] } },
            { $divide: [{ $toInt: { $substr: ["$end", 3, 2] } }, 60] },
          ],
        },
      },
    },
    { $addFields: { hours: { $subtract: ["$endMin", "$startMin"] } } },
    {
      $group: {
        _id: "$assignedEmployee",
        totalShifts: { $sum: 1 },
        totalHours: { $sum: "$hours" },
      },
    },
  ];

  const data = await Shift.aggregate(pipeline);

  return { employeeId, start, end, workload: data[0] || { totalShifts: 0, totalHours: 0 } };
};

const conflictsAndHourlyCoverage = async (
  req: Request
) => {
  const date = new Date(String(req.query.date));
  const location = String(req.query.location || "");

  const pipeline: any[] = [
    {
      $lookup: {
        from: "employees",
        localField: "assignedEmployee",
        foreignField: "_id",
        as: "employee",
      },
    },
    { $unwind: { path: "$employee", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        // bring in time-offs for assigned employee intersecting date
        from: "timeoffrequests",
        let: { empId: "$assignedEmployee", d: "$date" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$employee", "$$empId"] },
                  { $lte: ["$startDate", "$$d"] },
                  { $gte: ["$endDate", "$$d"] },
                  { $eq: ["$status", "APPROVED"] },
                ],
              },
            },
          },
        ],
        as: "timeOffs",
      },
    },
    // identify per-hour buckets (0..23) and emit one doc per hour for rollups
    {
      $addFields: {
        startHour: { $toInt: { $substr: ["$start", 0, 2] } },
        endHour: { $toInt: { $substr: ["$end", 0, 2] } },
      },
    },
    {
      $addFields: {
        hours: {
          $range: [
            "$startHour",
            {
              $cond: [
                { $lte: ["$endHour", "$startHour"] },
                { $add: ["$endHour", 24] },
                "$endHour",
              ],
            },
          ],
        },
      },
    },
    { $unwind: "$hours" },
    { $addFields: { hour: { $mod: ["$hours", 24] } } },
    {
      $group: {
        _id: { role: "$roleRequired", hour: "$hour" },
        totalRequired: { $sum: 1 },
        totalAssigned: {
          $sum: { $cond: [{ $ifNull: ["$assignedEmployee", false] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        role: "$_id.role",
        hour: "$_id.hour",
        totalRequired: 1,
        totalAssigned: 1,
        gap: { $subtract: ["$totalRequired", "$totalAssigned"] },
      },
    },
    { $sort: { role: 1, hour: 1 } },
  ];

  const hourly = await Shift.aggregate(pipeline);

  // Separate pipeline to detect double-bookings per employee for the day
  const doubleBooking = await Shift.aggregate([
    {
      $match: {
        date,
        assignedEmployee: { $exists: true, $ne: null },
        ...(location ? { location } : {}),
      },
    },
    {
      $group: {
        _id: "$assignedEmployee",
        shifts: { $push: { start: "$start", end: "$end", id: "$_id" } },
      },
    },
    {
      $project: {
        overlaps: {
          $function: {
            body: function (shifts: any[]) {
              // naive O(n^2) overlap check by hour ranges
              const parse = (t: string) => {
                const h = parseInt(t.slice(0, 2), 10),
                  m = parseInt(t.slice(3, 5), 10);
                return h + m / 60;
              };
              const out: any[] = [];
              for (let i = 0; i < shifts.length; i++) {
                for (let j = i + 1; j < shifts.length; j++) {
                  const a = shifts[i],
                    b = shifts[j];
                  const a1 = parse(a.start),
                    a2 = parse(a.end);
                  const b1 = parse(b.start),
                    b2 = parse(b.end);
                  // handle overnight by mapping < start to +24
                  const fix = (x: number, s: number) => (x < s ? x + 24 : x);
                  const A1 = a1,
                    A2 = fix(a2, a1);
                  const B1 = b1,
                    B2 = fix(b2, b1);
                  const overlap = Math.max(
                    0,
                    Math.min(A2, B2) - Math.max(A1, B1)
                  );
                  if (overlap > 0) out.push({ a, b, overlap });
                }
              }
              return out;
            },
            args: ["$shifts"],
            lang: "js",
          },
        },
      },
    },
  ]);

  return {
    date,
    location,
    hourlyCoverage:hourly,
    doubleBooking
  }
};

export const analyticService = {
  coverage,
  workload,
  conflictsAndHourlyCoverage
};
