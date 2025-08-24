import httpStatus from "http-status";
import {Secret} from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import {jwtHelpers} from "../../../helpers/jwtHelpers";
import {Employee} from "../Auth/auth.model";
import {hashPassword} from "../../../helpers/passwordHelpers";
import {IRegistration} from "../Auth/auth.validation";
import {Request} from "express";
import {paginationHelpers} from "../../../helpers/paginationHelper";
import {Role} from "../../../types/common";


const createEmployee = async (payload: IRegistration) => {
    const {email, password, ...rest} = payload;
    const exists = await Employee.findOne({email});
    if (exists) throw new ApiError(httpStatus.CONFLICT, "Email already used");
    const hashedPassword = await hashPassword(payload.password);
    const user = await Employee.create({
        email,
        password: hashedPassword,
        ...rest,
    });
    return {
        id: user._id,
    };
};

const getListEmployees = async (req: Request) => {
    const filters = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        role: req.query.role as Role | undefined,
        location: req.query.location as string | undefined,
    };

    const {page, limit, skip} = paginationHelpers.calculatePagination(filters);

    const whereCondition: any = {};

    if (filters.role) whereCondition.role = filters.role;
    if (filters.location) whereCondition.location = filters.location;
    const [items, total] = await Promise.all([
        Employee.find(whereCondition).skip(skip).limit(limit).lean(),
        Employee.countDocuments(whereCondition),
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
}

const getEmployee = async (employeeId: string) => {
    const doc = await Employee.findById(employeeId);
    if (!doc) throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');
    return doc
};


const updateEmployee = async (employeeId: string, payload: IRegistration) => {
    const doc = await Employee.findByIdAndUpdate(employeeId, payload, {new: true});
    if (!doc) throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');
    return doc
};


const deleteEmployee = async (employeeId: string) => {
    await Employee.findByIdAndDelete(employeeId);
};


export const employeeService = {
    createEmployee,
    getListEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee
}