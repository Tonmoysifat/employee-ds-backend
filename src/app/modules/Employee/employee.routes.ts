import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {employeeController} from "./employee.controller";
import {authValidation} from "../Auth/auth.validation";
import auth from "../../middlewares/auth";
import {Role} from "../../../types/common";


const router = express.Router();


router.post("/create-employee", auth("MANAGER"), validateRequest(authValidation.RegisterSchema), employeeController.createEmployee);
router.put("/update-employee/:employeeId", auth("MANAGER"), validateRequest(authValidation.RegisterSchema), employeeController.updateEmployee);
router.get("/get-employees-list", auth("MANAGER"), validateRequest(authValidation.RegisterSchema), employeeController.getListEmployees);
router.get("/get-single-employee/:employeeId", auth("MANAGER"), validateRequest(authValidation.RegisterSchema), employeeController.getEmployee);
router.delete("/delete-employee/:employeeId", auth("MANAGER"), validateRequest(authValidation.RegisterSchema), employeeController.deleteEmployee);

export const employeeRoutes = router