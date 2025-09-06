import { Request, Response } from 'express';
import { Bill, BillStatus } from '../models/bill';
import { Contact } from '../models/contact';
import { Family } from '../models/family';
import { z } from 'zod';

const billSchema = z.object({
    contactId: z.string().regex(/^[a-fA-F0-9]{24}$/),
    amount: z.number().min(1),
    description: z.string().min(2).max(128),
    familyId: z.string().regex(/^[a-fA-F0-9]{24}$/),
});

export const addBill = async (req: Request, res: Response) => {
    const parseResult = billSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid input', errors: parseResult.error.issues });
    }
    const { contactId, amount, description, familyId } = parseResult.data;
    const family = await Family.findById(familyId);
    if (!family) {
        return res.status(404).json({ message: 'Family not found' });
    }
    if (!family.members.includes(req.user!._id)) {
        return res.status(403).json({ message: 'Not a family member' });
    }
    const contact = await Contact.findById(contactId);
    if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
    }
    const bill = new Bill({ contact: contact._id, amount, description, family: family._id, addedBy: req.user!._id });
    await bill.save();
    res.status(201).json({ bill });
};

export const listBills = async (req: Request, res: Response) => {
    const { familyId } = req.params;
    const family = await Family.findById(familyId);
    if (!family) {
        return res.status(404).json({ message: 'Family not found' });
    }
    if (!family.members.includes(req.user!._id)) {
        return res.status(403).json({ message: 'Not a family member' });
    }
    const bills = await Bill.find({ family: family._id }).populate('contact');
    res.json({ bills });
};

const payBillSchema = z.object({
    billId: z.string().regex(/^[a-fA-F0-9]{24}$/),
});

export const markBillPaid = async (req: Request, res: Response) => {
    const parseResult = payBillSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid input', errors: parseResult.error.issues });
    }
    const { billId } = parseResult.data;
    const bill = await Bill.findById(billId);
    if (!bill) {
        return res.status(404).json({ message: 'Bill not found' });
    }
    bill.status = BillStatus.Paid;
    await bill.save();
    res.status(200).json({ bill });
};
