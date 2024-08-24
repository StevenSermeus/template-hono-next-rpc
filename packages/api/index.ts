import { Hono } from 'hono';

import { authApp } from './src/routes/auth';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { showRoutes } from 'hono/dev';
import type { VariablesHono } from './src/config/variables';
import { timeout } from 'hono/timeout';
import { printMetrics, registerMetrics } from './src/config/prometheus';
const app = new Hono<{ Variables: VariablesHono }>();
import { ipRestriction } from 'hono/ip-restriction';
import { getConnInfo } from 'hono/bun';
import { env } from './src/config/env';

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
    strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
    xFrameOptions: 'DENY',
    xXssProtection: '1',
  })
);

app.use(logger());
app.use(timeout(500));

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
