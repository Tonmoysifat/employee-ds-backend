import express from "express";

import { authRoutes } from "../modules/Auth/auth.routes";
import {employeeRoutes} from "../modules/Employee/employee.routes";
import { scheduleRoutes } from "../modules/Schedule/schedule.routes";
import { shiftRoutes } from "../modules/Shifts/shift.routes";
import { timeRequestRoutes } from "../modules/TimeOffRequest/timeOffRequesr.routes";
import { analyticRoutes } from "../modules/Analytics/analytics.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  } ,
  
  {
    path: "/employee",
    route: employeeRoutes,
  },
  {
    path: "/schedule",
    route: scheduleRoutes,
  },
  {
    path: "/shift",
    route: shiftRoutes,
  },
  {
    path: "/timeOffRequest",
    route: timeRequestRoutes,
  },
  {
    path: "/analytic",
    route: analyticRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
