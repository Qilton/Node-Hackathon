import { Request, Response } from 'express';
import { Contact, PaymentType } from '../models/contact';
import { z } from 'zod';

const updateMonthlySchema = z.object({
  contactId: z.string().regex(/^[a-fA-F0-9]{24}$/),
  paid: z.boolean(),
  nextDueDate: z.string().optional(), // ISO date string
});

export const updateMonthlyPayment = async (req: Request, res: Response) => {
  const parseResult = updateMonthlySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parseResult.error.issues });
  }
  const { contactId, paid, nextDueDate } = parseResult.data;
  const contact = await Contact.findById(contactId);
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  if (contact.paymentType !== PaymentType.Monthly) {
    return res.status(400).json({ message: 'Contact is not monthly payment type' });
  }
  if (paid) {
    contact.isDue = false;
    if (nextDueDate) contact.nextDueDate = new Date(nextDueDate);
  } else {
    contact.isDue = true;
  }
  await contact.save();
  res.json({ contact });
};
