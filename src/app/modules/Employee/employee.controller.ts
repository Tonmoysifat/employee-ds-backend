import {Request, Response} from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {employeeService} from "./employee.service";

const createEmployee = catchAsync(async (req: Request, res: Response) => {
    const result = await employeeService.createEmployee(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Employee created successfully",
        data: result,
    });
});

const getListEmployees = catchAsync(async (req: Request, res: Response) => {
    const result = await employeeService.getListEmployees(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Employee list fetched successfully",
        data: result,
    });
});

const getEmployee = catchAsync(async (req: Request, res: Response) => {

    const employeeId = req.params.employeeId
    const result = await employeeService.getEmployee(employeeId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single employee information fetched successfully",
        data: result,
    });
});

const updateEmployee = catchAsync(async (req: Request, res: Response) => {
    const employeeId = req.params.employeeId
    const result = await employeeService.updateEmployee(employeeId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Employee updated successfully",
        data: result,
    });
});

const deleteEmployee = catchAsync(async (req: Request, res: Response) => {
    const employeeId = req.params.employeeId
    const result = await employeeService.deleteEmployee(employeeId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Employee deleted successfully",
        data: result,
    });
});

export const employeeController = {
    createEmployee,
    getListEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee
}