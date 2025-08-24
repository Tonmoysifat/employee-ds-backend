import { IShift } from "./shift.validation";
import { Shift } from "./shift.model";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import { Employee } from "../Auth/auth.model";
import { Types } from "mongoose";
import { Request } from "express";
import { paginationHelpers } from "../../../helpers/paginationHelper";

const createShift = async (payload: IShift) => {
  const doc = await Shift.create({
    ...payload,
    date: new Date(payload as any),
  });
  return doc;
};

const assignShift = async (shiftId: string, employeeId: string) => {
  const shift = await Shift.findById(shiftId);
  if (!shift) throw new ApiError(httpStatus.NOT_FOUND, "Shift not found");
  const emp = await Employee.findById(employeeId);
  if (!emp) throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");

  // (Optional) add business rules: role/skill match, availability, time-off conflicts

  shift.assignedEmployee = emp._id as Types.ObjectId;
  const newShift = await shift.save();
  return newShift;
};

const listShifts = async (req: Request) => {
  const filters = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    date: req.query.date as string | undefined,
    location: req.query.location as string | undefined,
    roleRequired: req.query.roleRequired as string | undefined,
  };

  const { page, limit, skip } = paginationHelpers.calculatePagination(filters);
  const whereCondition: any = {};
  if (filters.date) whereCondition.date = new Date(String(filters.date));
  if (filters.location) whereCondition.location = filters.location;
  if (filters.roleRequired) whereCondition.roleRequired = filters.roleRequired;
  const [items, total] = await Promise.all([
    Shift.find(whereCondition)
      .skip(skip)
      .limit(limit)
      .populate("assignedEmployee", "name role skills")
      .lean(),
    Shift.countDocuments(whereCondition),
  ]);
  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    items,
  };
};

const getShift = async (shiftId: string) => {
  const doc = await Shift.findById(shiftId).populate(
    "assignedEmployee",
    "name role skills"
  );
  if (!doc) throw new ApiError(httpStatus.NOT_FOUND, "Shift not found");
  return doc;
};

const updateShift = async (shiftId: string, payload: IShift) => {
  const doc = await Shift.findByIdAndUpdate(shiftId, payload, {
    new: true,
  });
  if (!doc) throw new ApiError(httpStatus.NOT_FOUND, "Shift not found");
  return doc;
};

const deleteShift = async (shiftId: string) => {
  await Shift.findByIdAndDelete(shiftId);
};

export const shiftService = {
  createShift,
  assignShift,
  listShifts,
  getShift,
  updateShift,
  deleteShift,
};
