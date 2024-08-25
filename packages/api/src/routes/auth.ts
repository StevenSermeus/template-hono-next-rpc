import { Hono } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { sign } from 'hono/jwt';

import { z } from 'zod';

import { zValidator } from '@hono/zod-validator';

import { env } from '../config/env';
import { BlackListedTokenCounter } from '../config/prometheus';
import type { VariablesHono } from '../config/variables';
import { compare, hash } from '../libs/password';
import prisma from '../libs/prisma';
import { protectedRoute } from '../middleware/auth';

export const authRoutes = new Hono<{ Variables: VariablesHono }>();

export const authApp = authRoutes
  .post(
    '/login',
    zValidator(
      'json',
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
    ),
    async c => {
      const { email, password } = c.req.valid('json');
      try {
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (user === null) {
          return c.json({ error: 'Failed to login' }, 404);
        }
        const [verified, verifyError] = compare(password, user.password);
        if (verifyError !== null) {
          return c.json({ error: verifyError.message }, 500);
        }
        if (!verified) {
          return c.json({ error: 'Failed to login' }, 400);
        }
        const token = await sign(
          {
            user_id: user.id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * env.ACCESS_TOKEN_EXPIRES_MINUTES,
            iat: Math.floor(Date.now() / 1000),
          },
          env.JWT_ACCESS_SECRET
        );
        const refreshToken = await sign(
          {
            user_id: user.id,
            exp:
              Math.round(new Date().getTime() / 1000) +
              60 * 60 * 24 * env.REFRESH_TOKEN_EXPIRES_DAYS,
            iat: Math.floor(Date.now() / 1000),
          },
          env.JWT_REFRESH_SECRET
        );
        setCookie(c, 'refresh_token', refreshToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * env.REFRESH_TOKEN_EXPIRES_DAYS,
          secure: process.env.NODE_ENV === 'production',
        });
        setCookie(c, 'access_token', token, {
          httpOnly: true,
          maxAge: 60 * 60 * env.ACCESS_TOKEN_EXPIRES_MINUTES,
          secure: process.env.NODE_ENV === 'production',
        });
      } catch (error) {
        console.error(error);
        return c.json({ error: 'Failed to login' }, 400);
      }
      return c.json({ email, password });
    }
  )
  .post(
    '/register',
    zValidator(
      'json',
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
    ),
    async c => {
      const { email, password } = c.req.valid('json');
      const [hashedPassword, hashError] = hash(password);
      if (hashError !== null) {
        return c.json({ error: 'Failed to register' }, 500);
      }
      try {
        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
          },
        });
        const token = await sign(
          {
            user_id: user.id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
            iat: Math.floor(Date.now() / 1000),
          },
          env.JWT_ACCESS_SECRET
        );
        const refreshToken = await sign(
          {
            user_id: user.id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
            iat: Math.floor(Date.now() / 1000),
          },
          env.JWT_REFRESH_SECRET
        );
        setCookie(c, 'refresh_token', refreshToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * env.REFRESH_TOKEN_EXPIRES_DAYS,
        });
        setCookie(c, 'access_token', token, {
          httpOnly: true,
          maxAge: 60 * 60 * env.ACCESS_TOKEN_EXPIRES_MINUTES,
        });
        return c.json({ email }, 201);
      } catch (error) {
        console.error(error);
        return c.json({ error: 'Failed to register' }, 400);
      }
    }
  )
  .get('/me', protectedRoute, async c => {
    const user_id = c.get('user_id');
    if (!user_id) {
      return c.json({ error: 'User not found' }, 404);
    }
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(user_id),
      },
    });
    if (user === null) {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json({
      user: {
        email: user.email,
        id: user.id,
      },
    });
  })
  .post('/logout', protectedRoute, async c => {
    const refreshToken = getCookie(c, 'refresh_token');
    const accessToken = getCookie(c, 'access_token');
    if (refreshToken === undefined || accessToken === undefined) {
      return c.json({ message: 'Logged out' });
    }
    BlackListedTokenCounter.inc();
    deleteCookie(c, 'access_token');
    deleteCookie(c, 'refresh_token');
    await prisma.blacklist.createMany({
      data: [
        {
          id: refreshToken,
        },
        {
          id: accessToken,
        },
      ],
    });
    return c.json({ message: 'Logged out' });
  });
