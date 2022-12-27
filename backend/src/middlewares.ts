import { Request, Response, NextFunction } from 'express';
import { verify } from "jsonwebtoken";

export function authTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(!token || !process.env.ACCESS_TOKEN_SECRET) return res.sendStatus(401);

  verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
    if(error) return res.sendStatus(403);
    const { id } = payload as { id: string };

    (req as any).id = id;
    next();
  });
}