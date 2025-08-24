import express from "express";
import { scheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";


const router = express.Router();


router.get("/get-daily-schedule", auth(), scheduleController.dailySchedule);

export const scheduleRoutes = router