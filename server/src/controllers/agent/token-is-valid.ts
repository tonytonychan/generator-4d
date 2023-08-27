import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from '../../errors';

export const is_token_valid = async (req: Request, res: Response) => {
  try {
    const current_user = req.current_user;

    if (!current_user) throw new NotAuthorizedError();

    const token = req.session?.token;

    if (!token) throw new Error('Tidak bisa menemukan token');

    const exp = req.current_user?.exp;
    if (!exp) throw new Error('Tidak bisa menemukan exp token');

    const is_expired = new Date().getTime() > exp * 1000;
    if (is_expired) throw new Error('Token is expired');

    jwt.verify(token, process.env.JWT_KEY!);

    return res.status(200).json({ is_token_valid: true });
  } catch (error: any) {
    return res
      .status(200)
      .json({ is_token_valid: false, error: error.message });
  }
};
