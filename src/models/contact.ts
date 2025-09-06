import mongoose, { Schema, Document, Types } from 'mongoose';

export enum ServiceType {
  Plumber = 'Plumber',
  Maid = 'Maid',
  Electrician = 'Electrician',
  Carpenter = 'Carpenter',
  Cook = 'Cook',
  Driver = 'Driver',
  Gardener = 'Gardener',
  Painter = 'Painter',
  Security = 'Security',
  Technician = 'Technician',
  Other = 'Other',
}

export enum PaymentType {
  OneTime = 'OneTime',
  Monthly = 'Monthly',
}

export interface IContact extends Document {
  name: string;
  service: ServiceType;
  phone: string;
  notes?: string;
  paymentType: PaymentType;
  salary?: number;
  nextDueDate?: Date;
  isDue?: boolean;
  family: Types.ObjectId;
  addedBy: Types.ObjectId;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  service: { type: String, enum: Object.values(ServiceType), required: true },
  phone: { type: String, required: true },
  notes: { type: String },
  paymentType: { type: String, enum: Object.values(PaymentType), required: true },
  nextDueDate: {
    type: Date,
    default: function () {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; 
      const nextMonth = month > 11 ? 0 : month;
      const nextYear = month > 11 ? year + 1 : year;
      return new Date(nextYear, nextMonth, 1);
    },
  },
  salary: {
    type: Number,
    required: function (this: any) {
      return this.paymentType === 'Monthly';
    },
    min: 0,
  },
  isDue: { type: Boolean, default: false },
  family: { type: Schema.Types.ObjectId, ref: 'Family', required: true },
  addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
