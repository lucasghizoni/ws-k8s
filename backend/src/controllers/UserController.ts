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

      await user.save();

      const token = createToken(body);

      return res.json({ token });
    } catch (e) {
      console.error(e);
      return res.status(500).send();
    }
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
        const token = createToken(body);

        return res.json({ token });
      }

      return res.send('Not allowed');
    } catch (e) {
      return res.status(500).send();
    }
  }
};

function createToken(user: IUser) {
  if(!process.env.ACCESS_TOKEN_SECRET) {
    throw 'Missing config ACCESS_TOKEN_SECRET';
  }
  return sign(user, process.env.ACCESS_TOKEN_SECRET);
}