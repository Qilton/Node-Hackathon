import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFamilyCode extends Document {
  code: string;
  family: Types.ObjectId;
  used: boolean;
}

const FamilyCodeSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  family: { type: Schema.Types.ObjectId, ref: 'Family', required: true },
  used: { type: Boolean, default: false },
});

export const FamilyCode = mongoose.model<IFamilyCode>('FamilyCode', FamilyCodeSchema);
