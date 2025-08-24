import express from "express";

import { authRoutes } from "../modules/Auth/auth.routes";
import {employeeRoutes} from "../modules/Employee/employee.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  } ,{
    path: "/employee",
    route: employeeRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
