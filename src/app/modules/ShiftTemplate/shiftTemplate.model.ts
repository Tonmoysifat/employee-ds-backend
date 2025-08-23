import { Schema, model, Document } from 'mongoose';
import { Recurrence } from '../../../types/common';


export interface IShiftTemplate extends Document {
roleRequired: string;
skillRequired?: string;
location: string;
dayOfWeek: number; // 0-6
start: string;
end: string;
recurrence: Recurrence; // WEEKLY | BIWEEKLY | MONTHLY
}


const ShiftTemplateSchema = new Schema<IShiftTemplate>({
roleRequired: { type: String, required: true },
skillRequired: { type: String },
location: { type: String, required: true },
dayOfWeek: { type: Number, min: 0, max: 6, required: true },
start: { type: String, required: true },
end: { type: String, required: true },
recurrence: { type: String, required: true },
}, { timestamps: true });


export const ShiftTemplate = model<IShiftTemplate>('ShiftTemplate', ShiftTemplateSchema);