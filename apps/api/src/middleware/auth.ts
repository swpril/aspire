import { MiddlewareFn } from 'type-graphql';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export const authMiddleware: MiddlewareFn<{ token: string }> = async (
  { context },
  next
) => {
  const token = context.token;
  if (!token) {
    throw new Error('No token provided');
  }
  try {
    jwt.verify(token, SECRET_KEY, function (err) {
      if (err) {
        throw err;
      }
    });
  } catch {
    throw new Error('Invalid token');
  }
  return next();
};
