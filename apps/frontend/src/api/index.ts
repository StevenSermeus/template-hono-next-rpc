import type { AppRoutes } from '@yasumu/api';
import { hc } from 'hono/client';
export const api = hc<AppRoutes>('http://localhost:1234/', {
  init: {
    credentials: 'include',
  },
});
