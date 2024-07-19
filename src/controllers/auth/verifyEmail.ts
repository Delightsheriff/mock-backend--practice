// import { Request, Response } from 'express';

// // import { verifyEmailToken, isTokenExpired } from '../services/emailUtils';
// import User from '../../models/userModel';
// import { isTokenExpired, verifyEmailToken } from '../../common/utils/email';

// export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
//   const { token } = req.query;

//   if (typeof token !== 'string') {
//     res.status(400).json({ message: 'Invalid token' });
//   }

//   const decoded = verifyEmailToken(token);

//   if (!decoded) {
//      res.status(400).json({ message: 'Invalid token' });
//   }

//   const user = await User.findById(decoded.id);

//   if (!user || user.emailVerificationToken !== token) {
//     res.status(400).json({ message: 'Invalid token' });
//   }

//   if (isTokenExpired(user.emailVerificationExpiresAt)) {
//      res.status(400).json({ message: 'Token has expired' });
//   }

//   user.isEmailVerified = true;
//   user.emailVerificationToken = undefined;
//   user.emailVerificationExpiresAt = undefined;
//   await user.save();

//   res.json({ message: 'Email verified successfully' });
// });
