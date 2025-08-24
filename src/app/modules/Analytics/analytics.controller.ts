import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { analyticService } from "./analytics.service";

const coverage = catchAsync(async (req: Request, res: Response) => {
  const result = await analyticService.coverage(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coverage fetched successfully",
    data: result,
  });
});

const workload = catchAsync(async (req: Request, res: Response) => {
  const result = await analyticService.workload(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Workload data fetched successfully",
    data: result,
  });
});

const conflictsAndHourlyCoverage = catchAsync(
  async (req: Request, res: Response) => {
    const result = await analyticService.conflictsAndHourlyCoverage(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Conflicts and hourly coverage data fetched successfully",
      data: result,
    });
  }
);

export const analyticController = {
  coverage,
  workload,
  conflictsAndHourlyCoverage,
};
