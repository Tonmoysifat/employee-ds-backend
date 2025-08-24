import { Request } from "express";
import { Shift } from "../Shifts/shift.model";

const dailySchedule = async (req: Request) => {
  const date = new Date(String(req.query.date));
  const location = String(req.query.location || "");
  const pipeline: any[] = [
    { $match: { date, ...(location ? { location } : {}) } },
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
      $project: {
        date: 1,
        start: 1,
        end: 1,
        roleRequired: 1,
        location: 1,
        assignedEmployee: "$employee",
      },
    },
    { $sort: { start: 1 } },
  ];
  const data = await Shift.aggregate(pipeline);
  return { date, location, shifts: data };
};

export const scheduleService = {
  dailySchedule,
};
