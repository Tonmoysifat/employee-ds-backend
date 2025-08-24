import mongoose from "mongoose";
import config from "./config";
import { Employee } from "./app/modules/Auth/auth.model";
import { Shift } from "./app/modules/Shifts/shift.model";
import { TimeOffRequest } from "./app/modules/TimeOffRequest/timeOffRequest.model";
import { hashPassword } from "./helpers/passwordHelpers";

const hh = (h: number, m = 0) =>
  `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

(async () => {
  await mongoose.connect(config.databaseUrl as string);

  await Promise.all([
    Employee.deleteMany({}),
    Shift.deleteMany({}),
    TimeOffRequest.deleteMany({}),
  ]);

  const managerPwd = await hashPassword("manager123");
  const nursePwd = await hashPassword("nurse123");

  const employees = await Employee.insertMany([
    {
      name: "Alice Manager",
      email: "alice@acme.com",
      password: managerPwd,
      role: "MANAGER",
      location: "HQ",
      skills: ["admin"],
      availability: [
        { dayOfWeek: 1, start: "09:00", end: "17:00" },
        { dayOfWeek: 2, start: "09:00", end: "17:00" },
      ],
    },
    {
      name: "Bob Nurse",
      email: "bob@acme.com",
      password: nursePwd,
      role: "NURSE",
      location: "HQ",
      skills: ["IV", "CPR"],
      availability: [
        { dayOfWeek: 1, start: "07:00", end: "15:00" },
        { dayOfWeek: 2, start: "07:00", end: "15:00" },
      ],
    },
    {
      name: "Cara Nurse (Part-time)",
      email: "cara@acme.com",
      password: nursePwd,
      role: "NURSE",
      location: "HQ",
      skills: ["CPR"],
      availability: [
        { dayOfWeek: 1, start: "18:00", end: "22:00" },
        { dayOfWeek: 5, start: "18:00", end: "22:00" },
      ],
    },
    {
      name: "Dan Doctor",
      email: "dan@acme.com",
      password: nursePwd,
      role: "DOCTOR",
      location: "HQ",
      skills: ["surgery"],
      availability: [
        { dayOfWeek: 1, start: "10:00", end: "18:00" },
        { dayOfWeek: 2, start: "10:00", end: "18:00" },
      ],
    },
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [manager, bob, cara, dan] = employees;

  await Shift.insertMany([
    // Day shifts
    {
      date: today,
      start: hh(7),
      end: hh(15),
      roleRequired: "NURSE",
      skillRequired: "CPR",
      location: "HQ",
      assignedEmployee: bob._id,
    },
    {
      date: today,
      start: hh(9),
      end: hh(17),
      roleRequired: "MANAGER",
      location: "HQ",
      assignedEmployee: manager._id,
    },
    {
      date: today,
      start: hh(10),
      end: hh(18),
      roleRequired: "DOCTOR",
      location: "HQ",
      assignedEmployee: dan._id,
    },
    // Evening partial coverage
    {
      date: today,
      start: hh(18),
      end: hh(22),
      roleRequired: "NURSE",
      skillRequired: "CPR",
      location: "HQ",
      assignedEmployee: cara._id,
    },
    // Overnight shift (edge case)
    {
      date: today,
      start: hh(22),
      end: hh(6),
      roleRequired: "SECURITY",
      location: "HQ",
      assignedEmployee: null,
    },
    // Overlapping template-like (edge case): two nurses same time
    {
      date: today,
      start: hh(7),
      end: hh(15),
      roleRequired: "NURSE",
      skillRequired: "IV",
      location: "HQ",
      assignedEmployee: null,
    },
  ]);

  // Time-off: Bob off today (conflict)
  await TimeOffRequest.create({
    employeeId: bob._id,
    startDate: today,
    endDate: today,
    reason: "Personal",
    status: "APPROVED",
  });

  // Future pending request
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  await TimeOffRequest.create({
    employeeId: cara._id,
    startDate: tomorrow,
    endDate: tomorrow,
    reason: "Exam",
    status: "PENDING",
  });

  // eslint-disable-next-line no-console
  console.log("Seed completed.");
  process.exit(0);
})();
