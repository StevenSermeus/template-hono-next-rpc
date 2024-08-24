import { prometheus } from '@hono/prometheus';
const { printMetrics, registerMetrics } = prometheus();
import { Counter, Registry } from 'prom-client';

const registry = new Registry();
const BlackListedTokenCounter = new Counter({
  name: 'blacklisted_tokens',
  help: 'Number of blacklisted tokens',
  registers: [registry],
});

export { printMetrics, registerMetrics, BlackListedTokenCounter, registry };
