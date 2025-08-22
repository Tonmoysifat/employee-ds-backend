import { Schema, model, Document } from 'mongoose';
import { Role } from '../../../types/common';


export interface IAvailability {
dayOfWeek: number; // 0-6
start: string; // "09:00"
end: string; // "17:00"
}


export interface IEmployee extends Document {
name: string;
email: string;
password: string; // hashed
role: Role;
skills: string[];
location: string; // location/team
availability: IAvailability[];
isActive: boolean;
}


const AvailabilitySchema = new Schema<IAvailability>({
dayOfWeek: { type: Number, min: 0, max: 6, required: true },
start: { type: String, required: true },
end: { type: String, required: true },
}, { _id: false });


const EmployeeSchema = new Schema<IEmployee>({
name: { type: String, required: true },
email: { type: String, required: true, unique: true, index: true },
password: { type: String, required: true },
role: { type: String, required: true },
skills: { type: [String], default: [] },
location: { type: String, required: true, index: true },
availability: { type: [AvailabilitySchema], default: [] },
isActive: { type: Boolean, default: true },
}, { timestamps: true });


EmployeeSchema.index({ role: 1, location: 1 });


export const Employee = model<IEmployee>('Employee', EmployeeSchema);