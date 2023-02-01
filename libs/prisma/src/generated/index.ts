import { z } from 'zod';

// CUSTOM ENUMS
//------------------------------------------------------

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

// MAIN USER
//------------------------------------------------------

export const MainUserSchema = z.object({
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// MAIN USER CREDENTIAL INFO
//------------------------------------------------------

export const MainUserCredentialInfoSchema = z.object({
  id: z.string().uuid(),
  password: z.string(),
  userEmail: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// MAIN USER GOOGLE O AUTH INFO
//------------------------------------------------------

export const MainUserGoogleOAuthInfoSchema = z.object({
  id: z.string().uuid(),
  userEmail: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
