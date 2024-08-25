import { hc } from 'hono/client';

import type { AppRoutes } from '@yasumu/api';

export const api = hc<AppRoutes>('http://localhost:1234/', {
  init: {
    credentials: 'include',
  },
});
