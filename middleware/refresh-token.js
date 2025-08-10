import User from '../models/users.js';
import jwt from 'jsonwebtoken';

export const refreshToken = async (req, res) => {
    const refreshTokenCookie = req.cookies?.refreshToken;

    if (!refreshTokenCookie) {
        res.clearCookie('token', { httpOnly: true });
        return res.redirect('/');
    }

    try {
        const decoded = jwt.verify(refreshTokenCookie, process.env.JWT_SECRET); // Use a separate secret for refresh tokens

        const userRecord = await User.findByPk(decoded.id);
        if (!userRecord || userRecord.refreshToken !== refreshTokenCookie) {
            return res.redirect('/');
        }

        const newAccessToken = jwt.sign(
            { id: userRecord.id, email: userRecord.email },
            process.env.JWT_SECRET,
            { expiresIn: '5m' }
        );

        res.cookie('token', newAccessToken, { httpOnly: true });
        return res.redirect('/');

    } catch (err) {
        console.error(err);
        res.clearCookie('token', { httpOnly: true });
        return res.redirect('/');
    }
};
