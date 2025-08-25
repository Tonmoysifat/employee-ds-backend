import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
// import emailSender from "../../../helpers/emailSender/emailSender";
import {
  comparePassword,
  hashPassword,
} from "../../../helpers/passwordHelpers";
import { ILogin, IRegistration } from "./auth.validation";
import { Employee } from "./auth.model";

const register = async (payload: IRegistration) => {
  const { email, password, ...rest } = payload;
  const exists = await Employee.findOne({ email });
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

export const login = async (payload: ILogin) => {
  const { email, password } = payload;
  const user = await Employee.findOne({ email });
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  const isCorrectPassword: boolean = await comparePassword(
    password,
    user.password
  );
  if (!isCorrectPassword) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  const token = jwtHelpers.generateToken(
    {
      id: user.id,
      role: user.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );
  return {
    token,
  };
};

export const authService = {
  register,
  login
};