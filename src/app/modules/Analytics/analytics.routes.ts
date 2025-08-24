import express from "express";
import { analyticController } from "./analytics.controller";
import auth from "../../middlewares/auth";


const router = express.Router();


router.get("/get-coverage",auth("MANAGER"), analyticController.coverage);
router.get("/get-workload",auth("MANAGER"), analyticController.workload);
router.get("/get-conflicts-coverage",auth("MANAGER"), analyticController.conflictsAndHourlyCoverage);

export const analyticRoutes = router