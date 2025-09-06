import { Request, Response } from 'express';
import { User } from '../models/users';
import { signJwt } from '../utils/jwt';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const userSchema = z.object({
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
  const parseResult = userSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ message: 'Invalid input', errors: parseResult.error.issues });
    return;
  }
  const { username, password } = parseResult.data;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(409).json({ message: 'Username already exists' });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.status(201).json({ message: 'User registered successfully' });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const parseResult = userSchema.safeParse(req.body);
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
  const token = signJwt({ id: user._id, username: user.username });
  res.json({ token });
};

export const getProfile = (req: Request, res: Response): void => {
  // req.user is set by auth middleware
  // @ts-ignore
  res.json({ user: req.user });
};
