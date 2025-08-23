import { Schema, model, Document, Types } from "mongoose";


export interface IShift extends Document {
date: Date; // base date (shift might cross midnight)
start: string; // HH:mm (local)
end: string; // HH:mm
roleRequired: string;
skillRequired?: string;
location: string;
assignedEmployee?: Types.ObjectId | null;
}


const ShiftSchema = new Schema<IShift>({
date: { type: Date, required: true, index: true },
start: { type: String, required: true },
end: { type: String, required: true },
roleRequired: { type: String, required: true },
skillRequired: { type: String },
location: { type: String, required: true, index: true },
assignedEmployee: { type: Schema.Types.ObjectId, ref: 'Employee', default: null, index: true },
}, { timestamps: true });


ShiftSchema.index({ date: 1, location: 1 });


export const Shift = model<IShift>('Shift', ShiftSchema);