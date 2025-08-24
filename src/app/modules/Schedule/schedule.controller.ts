import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { scheduleService } from "./schedule.service";

const dailySchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.dailySchedule(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Daily schedule fetched successfully",
    data: result,
  });
});

export const scheduleController = {
    dailySchedule
}