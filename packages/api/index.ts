import { Hono } from 'hono';

import { authApp } from './src/routes/auth';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { showRoutes } from 'hono/dev';
import type { VariablesHono } from './src/config/variables';

const app = new Hono<{ Variables: VariablesHono }>();

app.use(
  '*',
  cors({
    origin: 'http://localhost:3000', // Allowed origin
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowHeaders: ['Content-Type', 'Authorization', 'X-Refresh-Token'], // Allowed HTTP headers
    maxAge: 86400,
    exposeHeaders: ['X-Access-Token', 'X-Refresh-Token', 'Set-Cookie'],
    credentials: true,
  })
);

app.use(
  secureHeaders({
    strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
    xFrameOptions: 'DENY',
    xXssProtection: '1',
  })
);

app.use(logger());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route = app.route('/user/auth', authApp);

showRoutes(app, {
  colorize: true,
  verbose: true,
});
export default app;

export type AppRoutes = typeof route;
