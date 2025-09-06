
import { Request, Response } from 'express';
import { FamilyNote } from '../models/familyNote';
import { Family } from '../models/family';
import { z } from 'zod';

const addNoteSchema = z.object({
  familyId: z.string().regex(/^[a-fA-F0-9]{24}$/),
  message: z.string().min(1).max(256),
});

export const addFamilyNote = async (req: Request, res: Response) => {
  const parseResult = addNoteSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parseResult.error.issues });
  }
  const { familyId, message } = parseResult.data;
  const family = await Family.findById(familyId);
  if (!family) return res.status(404).json({ message: 'Family not found' });
  if (!family.members.includes(req.user!._id)) return res.status(403).json({ message: 'Not a family member' });
  const note = new FamilyNote({ family: family._id, message, createdBy: req.user!._id });
  await note.save();
  res.status(201).json({ note });
};

export const listFamilyNotes = async (req: Request, res: Response) => {
  const { familyId } = req.params;
  const family = await Family.findById(familyId);
  if (!family) return res.status(404).json({ message: 'Family not found' });
  if (!family.members.includes(req.user!._id)) return res.status(403).json({ message: 'Not a family member' });
  const notes = await FamilyNote.find({ family: family._id }).sort({ createdAt: -1 });
  res.json({ notes });
};
const editNoteSchema = z.object({
  noteId: z.string().regex(/^[a-fA-F0-9]{24}$/),
  message: z.string().min(1).max(256),
});

export const editFamilyNote = async (req: Request, res: Response) => {
  const parseResult = editNoteSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parseResult.error.issues });
  }
  const { noteId, message } = parseResult.data;
  const note = await FamilyNote.findById(noteId);
  if (!note) return res.status(404).json({ message: 'Note not found' });
  if (String(note.createdBy) !== String(req.user!._id)) {
    return res.status(403).json({ message: 'Only the creator can edit this note' });
  }
  note.message = message;
  await note.save();
  res.status(200).json({ note });
};

const deleteNoteSchema = z.object({
  noteId: z.string().regex(/^[a-fA-F0-9]{24}$/),
});

export const deleteFamilyNote = async (req: Request, res: Response) => {
  const parseResult = deleteNoteSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parseResult.error.issues });
  }
  const { noteId } = parseResult.data;
  const note = await FamilyNote.findById(noteId);
  if (!note) return res.status(404).json({ message: 'Note not found' });
  if (String(note.createdBy) !== String(req.user!._id)) {
    return res.status(403).json({ message: 'Only the creator can delete this note' });
  }
  await note.deleteOne();
  res.status(200).json({ message: 'Note deleted' });
};