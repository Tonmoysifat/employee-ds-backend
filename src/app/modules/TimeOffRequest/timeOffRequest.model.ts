import { Schema, model, Document, Types } from 'mongoose';
import { TimeOffStatus } from '../../../types/common';


export interface ITimeOffRequest extends Document {
employeeId: Types.ObjectId;
startDate: Date;
endDate: Date;
reason?: string;
status: TimeOffStatus;
}


const TimeOffRequestSchema = new Schema<ITimeOffRequest>({
employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
startDate: { type: Date, required: true, index: true },
endDate: { type: Date, required: true, index: true },
reason: { type: String },
status: { type: String, required: true, default: 'PENDING' },
}, { timestamps: true });


TimeOffRequestSchema.index({ employee: 1, startDate: 1, endDate: 1 });


export const TimeOffRequest = model<ITimeOffRequest>('TimeOffRequest', TimeOffRequestSchema);