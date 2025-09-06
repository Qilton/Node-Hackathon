import mongoose, { Schema, Document, Types } from 'mongoose';

export enum BillStatus {
  Due = 'Due',
  Paid = 'Paid',
}

export interface IBill extends Document {
  contact: Types.ObjectId;
  amount: number;
  description: string;
  status: BillStatus;
  family: Types.ObjectId;
  addedBy: Types.ObjectId;
  date: Date;
}

const BillSchema: Schema = new Schema({
  contact: { type: Schema.Types.ObjectId, ref: 'Contact', required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: Object.values(BillStatus), default: BillStatus.Due },
  family: { type: Schema.Types.ObjectId, ref: 'Family', required: true },
  addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
});

export const Bill = mongoose.model<IBill>('Bill', BillSchema);
