// backend/src/types/express.d.ts
// Augment the Express Request type to include `user` from @topsmile/types.

import { User } from '@topsmile/types';

declare global {
  namespace Express {
    interface Request {
      // optional because some requests (e.g. public endpoints) won't have a user
      user?: User;
    }
  }
}

// Keep the file a module to avoid global scope pollution if your TS config requires it
export {};
