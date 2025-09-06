
import { Request, Response } from 'express';
import { Contact, ServiceType, PaymentType } from '../models/contact';
import { Family } from '../models/family';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2).max(64),
  service: z.nativeEnum(ServiceType),
  paymentType: z.nativeEnum(PaymentType),
  phone: z.string().min(7).max(15),
  notes: z.string().max(128).optional(),
  familyId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid family ID'),
  salary: z.number().min(0).optional(), 
});

const updateNotesSchema = z.object({
  contactId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid contact ID'),
  notes: z.string().max(128),
});

export const addContact = async (req: Request, res: Response) => {
  const parseResult = contactSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parseResult.error.issues });
  }
  const { name, service, phone, notes, paymentType, familyId, salary } = parseResult.data;
  const family = await Family.findById(familyId);
  if (!family) {
    return res.status(404).json({ message: 'Family not found' });
  }
  if (!family.members.includes(req.user!._id)) {
    return res.status(403).json({ message: 'Not a family member' });
  }
  if (paymentType === PaymentType.Monthly && (typeof salary !== 'number' || salary < 0)) {
    return res.status(400).json({ message: 'Salary is required and must be >= 0 for monthly payment type' });
  }
  const contact = new Contact({
    name,
    service,
    phone,
    notes,
    paymentType,
    family: family._id,
    addedBy: req.user!._id,
    ...(paymentType === PaymentType.Monthly ? { salary } : {}),
  });
  await contact.save();
  res.status(201).json({ contact });
};

export const listContacts = async (req: Request, res: Response) => {
  const { familyId } = req.params;
  const family = await Family.findById(familyId);
  if (!family) {
    return res.status(404).json({ message: 'Family not found' });
  }
  if (!family.members.includes(req.user!._id)) {
    return res.status(403).json({ message: 'Not a family member' });
  }
  const contacts = await Contact.find({ family: family._id });
  res.json({ contacts });
};



export const updateContactNotes = async (req: Request, res: Response) => {
  const parseResult = updateNotesSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parseResult.error.issues });
  }
  const { contactId, notes } = parseResult.data;
  const contact = await Contact.findById(contactId);
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  const family = await Family.findById(contact.family);
  if (!family || !family.members.includes(req.user!._id)) return res.status(403).json({ message: 'Not a family member' });
  contact.notes = notes;
  await contact.save();
  res.status(200).json({ contact });
};
const deleteContactSchema = z.object({
  contactId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid contact ID'),
});

export const deleteContact = async (req: Request, res: Response) => {
  const parseResult = deleteContactSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parseResult.error.issues });
  }
  const { contactId } = parseResult.data;
  const contact = await Contact.findById(contactId);
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  const family = await Family.findById(contact.family);
  if (!family) return res.status(404).json({ message: 'Family not found' });
  if (String(family.owner) !== String(req.user!._id)) return res.status(403).json({ message: 'Only owner can delete contacts' });
  await contact.deleteOne();
  res.status(200).json({ message: 'Contact deleted' });
};