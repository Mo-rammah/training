import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const isAuth = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        console.log("Invalid login token — no token provided");
        return res.redirect('/login');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.log("Access token expired — redirecting to refresh");
                return res.redirect(`/refresh?redirect=${encodeURIComponent(req.originalUrl)}`);
            }
            console.log("JWT verification failed:", err.message);
            return res.redirect('/login');
        }

        req.user = decoded;
        next();
    });
};

export default isAuth;
