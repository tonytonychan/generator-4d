import { Request, Response } from 'express';
// import { DateTime } from 'luxon';
// import { NotAuthorizedError } from '../../error/not-authorized';
// import { Log } from '../../model/log';

export const logout = async (req: Request, res: Response) => {
  req.session = null;

  //   Log.build({ agent: currentUser.username, description: `Logout`, target: '-', type: 'USER', time: DateTime.now().setZone('UTC+7') }).save();

  res.status(200).send({ message: 'Logout berhasil.' });
};
