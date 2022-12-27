import { Response, Request } from 'express';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import User, { IUser } from '../models/User';

export = {
  async store({ body }: Request<IUser>, res: Response) {
    try {
      if(await User.findOne({ name: body.name })) {
        return res.sendStatus(403);
      }

      const hashedPassword = await hash(body.password, 10);
      const user = new User({
        name: body.name,
        password: hashedPassword
      });

      const savedUser = await user.save();

      const token = createToken({ id: savedUser._id.toString() });

      return res.json({ token });
    } catch (e) {
      console.error(e);
      return res.status(500).send();
    }
  },
  async info(req: Request, res: Response) {
    try {
      const user = await User.findOne({ _id: (req as any).id });

      if(user) {
        return res.json({name: user.name, id: user._id});
      }
    } catch (e) {
      console.error(e);
    }
    return res.status(500).send();
  },
  async find(req: Request, res: Response) {
    try {
      const users = await User.find();
      return res.json({ users: users.map(({ name, _id }) => ({ name, id: _id }))});
    } catch (e) {
      return res.status(500).send();
    }
  },
  async login({ body }: Request<IUser>, res: Response) {
    try {
      const user = await User.findOne({ name: body.name });

      if(user === null) {
        return res.status(400).send('User not found');
      }

      if(await compare(body.password, user.password)) {
        const token = createToken({ id: user._id.toString() });

        return res.json({ token });
      }

      return res.send('Not allowed');
    } catch (e) {
      return res.status(500).send();
    }
  }
};

function createToken(data: {id: string}) {
  if(!process.env.ACCESS_TOKEN_SECRET) {
    throw 'Missing config ACCESS_TOKEN_SECRET';
  }
  return sign(data, process.env.ACCESS_TOKEN_SECRET);
}