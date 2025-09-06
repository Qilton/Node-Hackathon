


import { Request, Response } from 'express';
import { Family } from '../models/family';
import { FamilyCode } from '../models/familyCode';
import crypto from 'crypto';
import { z } from 'zod';

const kickMemberSchema = z.object({
    familyId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid family ID'),
    memberId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid member ID'),
});

export const createFamily = async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Invalid input', errors: 'Name is required' });
    }
    const existingFamily = await Family.findOne({
        $or: [
            { owner: req.user?._id },
            { members: req.user?._id }
        ]
    });
    if (existingFamily) {
        return res.status(403).json({ message: 'You are already an owner or member of a family.' });
    }
    const family = new Family({ name, owner: req.user?._id, members: [req.user?._id] });
    await family.save();
    res.status(201).json({ family });
};

const generateCodeSchema = z.object({
    familyId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid family ID'),
});

export const generateFamilyCode = async (req: Request, res: Response) => {
    const parseResult = generateCodeSchema.safeParse(req.params);
    if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid input', errors: parseResult.error.issues });
    }
    const { familyId } = parseResult.data;
    const family = await Family.findById(familyId);
    if (!family) {
        return res.status(404).json({ message: 'Family not found' });
    }
    if (String(family.owner) !== String(req.user?._id)) {
        return res.status(403).json({ message: 'Only owner can generate code' });
    }
    const code = crypto.randomBytes(4).toString('hex');
    const familyCode = new FamilyCode({ code, family: family._id });
    await familyCode.save();
    res.status(201).json({ code });
};

const joinCodeSchema = z.object({
    code: z.string().length(8, 'Code must be 8 characters'),
});

export const joinFamilyWithCode = async (req: Request, res: Response) => {
    const parseResult = joinCodeSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid input', errors: parseResult.error.issues });
    }
    const { code } = parseResult.data;
    const existingFamily = await Family.findOne({
        $or: [
            { owner: req.user?._id },
            { members: req.user?._id }
        ]
    });
    if (existingFamily) {
        return res.status(403).json({ message: 'You are already an owner or member of a family.' });
    }
    const familyCode = await FamilyCode.findOne({ code });
    if (!familyCode || familyCode.used) {
        return res.status(400).json({ message: 'Invalid or used code' });
    }
    const family = await Family.findById(familyCode.family);
    if (!family) {
        return res.status(404).json({ message: 'Family not found' });
    }
    if (req.user) {
        if (family.members.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already a member' });
        }
        family.members.push(req.user._id);
    }
    await family.save();
    familyCode.used = true;
    await familyCode.save();
    res.status(200).json({ message: 'Joined family', family });
};

export const kickFamilyMember = async (req: Request, res: Response) => {
  const parsed = kickMemberSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input", errors: parsed.error.issues });
  }

  const { familyId, memberId } = parsed.data;
  const family = await Family.findById(familyId);
  if (!family) return res.status(404).json({ message: "Family not found" });

  if (String(family.owner) !== String(req.user?._id)) {
    return res.status(403).json({ message: "Only owner can kick members" });
  }

  if (String(family.owner) === String(memberId)) {
    return res.status(400).json({ message: "Owner cannot be kicked" });
  }

  if (!family.members.some((id: any) => String(id) === String(memberId))) {
    return res.status(404).json({ message: "Member not found in family" });
  }

  family.members = family.members.filter((id: any) => String(id) !== String(memberId));
  await family.save();

  return res.status(200).json({ message: "Member kicked", family });
};
