import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { timeOffService } from "./timeOffRequest.service";

const createTimeOff = catchAsync(async (req: Request, res: Response) => {
  const employeeId = req.user.id;
  const result = await timeOffService.createTimeOff(employeeId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Time off request created successfully",
    data: result,
  });
});

const listTimeOff = catchAsync(async (req: Request, res: Response) => {
  const result = await timeOffService.listTimeOff(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Time off requests fetched successfully",
    data: result,
  });
});

const getTimeOff = catchAsync(async (req: Request, res: Response) => {
  const timeOffRequestId = req.params.id;
  const result = await timeOffService.getTimeOff(timeOffRequestId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Time off request fetched successfully",
    data: result,
  });
});

const approveTimeOff = catchAsync(async (req: Request, res: Response) => {
  const timeOffRequestId = req.params.id;
  const result = await timeOffService.approveTimeOff(
    timeOffRequestId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message:
      req.body.status === "APPROVED"
        ? "Time off request approved"
        : "Time off request rejected",
    data: result,
  });
});

export const timeOfController = {
  createTimeOff,
  approveTimeOff,
  listTimeOff,
  getTimeOff
};
