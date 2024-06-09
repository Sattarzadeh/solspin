import * as z from 'zod';
import { EventProvider } from '../types';

export interface UserCreatedPayload {
  userId: string;
  email: string;
  name: string;
  createdAt: string;
}

export const userCreatedEventSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2).max(100),
  createdAt: z.string().datetime(),
});

export const userCreatedEvent: EventProvider = {
  name: 'UserCreated',
  schema: userCreatedEventSchema,
};