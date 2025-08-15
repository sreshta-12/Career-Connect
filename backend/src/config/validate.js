import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const profileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  linkedin: z.string().url().optional(),
  skills: z.array(z.string()).default([]),
  walletAddress: z.string().optional(),
});
export const jobSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  skills: z.array(z.string()).default([]),
  budget: z.number().nonnegative().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).default([]),
});
export const paymentConfirmSchema = z.object({
  txHash: z.string().min(10),
  from: z.string().min(10),
  to: z.string().min(10),
  amountEth: z.number().positive(),
  network: z.string().default('sepolia')
});
