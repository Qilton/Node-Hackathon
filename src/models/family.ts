import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFamily extends Document {
  name: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
}

const FamilySchema: Schema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export const Family = mongoose.model<IFamily>('Family', FamilySchema);
