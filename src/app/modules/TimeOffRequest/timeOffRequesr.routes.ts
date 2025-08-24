import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { timeOffValidation } from "./timeOffRequest.validation";
import { timeOfController } from "./timeOffRequest.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-time-off-request",
  validateRequest(timeOffValidation.TimeOffCreateSchema),
  timeOfController.createTimeOff
);
router.put(
  "/approve-or-reject-time-off-request/:id",
  auth("MANAGER"),
  validateRequest(timeOffValidation.ApproveRejectSchema),
  timeOfController.approveTimeOff
);

router.get(
  "/get-list-of-time-off-requests",
  auth("MANAGER"),
  timeOfController.listTimeOff
);

router.get(
  "/get-of-time-off-request-by-id/:id",
  auth("MANAGER"),
  timeOfController.getTimeOff
);

export const timeRequestRoutes = router;
