import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { shiftController } from "./shift.controller";
import { shiftValidation } from "./shift.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-shift",
  auth("MANAGER"),
  validateRequest(shiftValidation.CreateShiftSchema),
  shiftController.createShift
);

router.put(
  "/update-shift",
  auth("MANAGER"),
  validateRequest(shiftValidation.updateShift),
  shiftController.updateShift
);
router.post(
  "/assign-shift/:id",
  auth("MANAGER"),
  validateRequest(shiftValidation.AssignShiftSchema),
  shiftController.assignShift
);

router.get("/list-shift", auth("MANAGER"), shiftController.listShifts);
router.get("/get-shift/:id", auth(), shiftController.getShift);
router.delete(
  "/delete-shift/:id",
  auth("MANAGER"),
  shiftController.deleteShift
);

export const authRoutes = router;
