import { NextFunction, Response, Request } from 'express';
import userService from './user.service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TypedRequest } from '../../utils/typed-request';
import { UserModel } from './user.model';
import { User } from './user.entity';

export const me = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction,
) => {
  res.json(req.user!);
};

export const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req.body;

  if (!token) {
    res.status(400).send('Missing token');
  }

  try {
    const key = process.env.SECRET_MAIL_KEY;
    const { userId } = jwt.verify(token, key!) as JwtPayload;

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).send('User not found');
    }

    user!.isConfirmed = true;
    await user!.save();
    res.status(200).send('Email confirmed successfully');
  } catch (err) {
    res.status(400).send('Invalid or expired token');
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user! as User;

    const { newPassword, confirmPassword } = req.body;

    const updatedUser = await userService.updatePassword(
      user,
      newPassword,
      confirmPassword,
    );

    res.json(updatedUser);
    res.status(200);
  } catch (err) {
    next(err);
  }
};

export const updateProfilePicture = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user! as User;
    const { url } = req.body;

    if (!url) {
      res.status(400).send('Profile picture URL is required');
    }

    const updatedUser = await userService.updateProfilePicture(user.id!, url);

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const list = await userService.list();

  res.json(list);
};
