import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFamilyNote extends Document {
  family: Types.ObjectId;
  message: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const FamilyNoteSchema: Schema = new Schema({
  family: { type: Schema.Types.ObjectId, ref: 'Family', required: true },
  message: { type: String, required: true, maxlength: 256 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const FamilyNote = mongoose.model<IFamilyNote>('FamilyNote', FamilyNoteSchema);
