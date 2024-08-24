import { Hono } from 'hono';

export const UserRoutes = new Hono();

const userRoute = new Hono();

export const userApp = userRoute
  .get('/:id', c => c.json({ result: `get ${c.req.param('id')}` }))
  .post('/', c => c.json({ result: 'create' }, 201));
