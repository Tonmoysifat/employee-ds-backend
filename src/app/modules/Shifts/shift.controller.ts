import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { shiftService } from "./shift.service";

const createShift = catchAsync(async (req: Request, res: Response) => {
  const result = await shiftService.createShift(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Shift created successfully",
    data: result,
  });
});

const updateShift = catchAsync(async (req: Request, res: Response) => {
  const shiftId = req.params.id;
  const result = await shiftService.updateShift(shiftId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Shift updated successfully",
    data: result,
  });
});

const assignShift = catchAsync(async (req: Request, res: Response) => {
  const shiftId = req.params.id;
  const employeeId = req.body.employeeId;
  const result = await shiftService.assignShift(shiftId, employeeId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Shift assigned successfully",
    data: result,
  });
});

const listShifts = catchAsync(async (req: Request, res: Response) => {
  const result = await shiftService.listShifts(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All shift fetched successfully",
    data: result,
  });
});

const getShift = catchAsync(async (req: Request, res: Response) => {
  const shiftId = req.params.id;

  const result = await shiftService.getShift(shiftId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shift fetched successfully",
    data: result,
  });
});

const deleteShift = catchAsync(async (req: Request, res: Response) => {
  const shiftId = req.params.id;

  const result = await shiftService.deleteShift(shiftId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shift deleted successfully",
    data: result,
  });
});

export const shiftController = {
  createShift,
  assignShift,
  listShifts,
  getShift,
  updateShift,
  deleteShift,
};
