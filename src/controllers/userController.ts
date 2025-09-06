
import { Request, Response } from 'express';
import { User } from '../models/users';
import { Family } from '../models/family';
import { signJwt } from '../utils/jwt';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import config from '../config/config';
const registerSchema = z.object({
  username: z.string().min(3).max(32),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(128, { message: 'Password must be at most 128 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  email: z.string().email(),
});

const loginSchema = z.object({
  username: z.string().min(3).max(32),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(128, { message: 'Password must be at most 128 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
});

export const register = async (req: Request, res: Response): Promise<void> => {
	
  const parseResult = registerSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ message: 'Invalid input', errors: parseResult.error.issues });
    return;
  }
  const { username, password, email } = parseResult.data;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(409).json({ message: 'Username already exists' });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, email });
  await newUser.save();
  res.status(201).json({ message: 'User registered successfully' });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const parseResult = loginSchema.safeParse(req.body);
  console.log("Mongo URI:",config.mongoUri);
  if (!parseResult.success) {
    res.status(400).json({ message: 'Invalid input', errors: parseResult.error.issues });
    return;
  }
  const { username, password } = parseResult.data;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const family = await Family.findOne({
    $or: [
      { owner: user._id },
      { members: user._id }
    ]
  });
  const token = signJwt({ id: user._id, username: user.username });
  res.json({ token, familyId: family ? family._id : null });
};

export const getProfile = (req: Request, res: Response): void => {
  // req.user is set by auth middleware
  // @ts-ignore
  res.json({ user: req.user });
};

export const getUserId = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  res.json({ userId: req.user._id });
};

export const getUserIdByUsername = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  if (!username) {
    res.status(400).json({ message: 'Username is required' });
    return;
  }
  const user = await User.findOne({ username });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json({ userId: user._id });
};
