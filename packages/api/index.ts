import { Hono } from 'hono';
import { getConnInfo } from 'hono/bun';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';
import { ipRestriction } from 'hono/ip-restriction';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { timeout } from 'hono/timeout';

import { env } from './src/config/env';
import { printMetrics, registerMetrics } from './src/config/prometheus';
import type { VariablesHono } from './src/config/variables';
import { authApp } from './src/routes/auth';

const app = new Hono<{ Variables: VariablesHono }>();

app.use(timeout(500));
app.use(
  '*',
  cors({
    origin: env.WEBSITE_URL, // Allowed origin
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    maxAge: 86400,
    credentials: true,
  })
);

app.use(
  secureHeaders({
    xFrameOptions: true,
    xXssProtection: true,
  })
);

app.use(logger());

app.use('*', registerMetrics);

app.get(
  '/metrics',
  ipRestriction(getConnInfo, {
    denyList: [],
    allowList: ['127.0.0.1', '::1'],
  }),
  printMetrics
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route = app.route('/user/auth', authApp);

showRoutes(app, {
  colorize: true,
  verbose: true,
});
export default app;

export type AppRoutes = typeof route;
