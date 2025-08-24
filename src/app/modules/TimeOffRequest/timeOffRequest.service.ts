import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import { Employee } from "../Auth/auth.model";
import { Types } from "mongoose";
import { Request } from "express";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IArtor, ITimeOff } from "./timeOffRequest.validation";
import { TimeOffRequest } from "./timeOffRequest.model";
import { TimeOffStatus } from "../../../types/common";

const createTimeOff = async (employeeId: string, payload: ITimeOff) => {
  const doc = await TimeOffRequest.create({
    ...payload,
    employeeId,
    startDate: new Date(payload.startDate as any),
    endDate: new Date(payload.endDate as any),
  });
  return doc;
};

const listTimeOff = async (req: Request) => {
  const filters = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    status: req.query.status as TimeOffStatus | undefined,
  };

  const { page, limit, skip } = paginationHelpers.calculatePagination(filters);
  const whereCondition: any = {};
  if (filters.status) whereCondition.status = filters.status;
  const [items, total] = await Promise.all([
    TimeOffRequest.find(whereCondition)
      .skip(skip)
      .limit(limit)
      .populate("employee", "name role")
      .lean(),
    TimeOffRequest.countDocuments(whereCondition),
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

const getTimeOff = async (timeOffRequestId: string) => {
  const doc = await TimeOffRequest.findById(timeOffRequestId).populate(
    "employee",
    "name role"
  );
  if (!doc) throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  return doc;
};

const approveTimeOff = async (timeOffRequestId: string, payload: IArtor) => {
  const doc = await TimeOffRequest.findByIdAndUpdate(
    timeOffRequestId,
    { status: payload.status },
    { new: true }
  );
  if (!doc) throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  return doc;
};

export const timeOffService = {
  createTimeOff,
  approveTimeOff,
  listTimeOff,
  getTimeOff
};
