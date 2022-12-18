import { Request, Response, NextFunction } from 'express';
import { verify } from "jsonwebtoken";

export function authToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(!token) return res.sendStatus(401);

  if(!process.env.ACCESS_TOKEN_SECRET) {
    console.error('Missing ACCESS_TOKEN_SECRET');
    return res.sendStatus(500);
  }

  verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403);
    next();
  });
}