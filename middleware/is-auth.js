import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const isAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        console.log("invalid login token");
        return res.redirect('/login');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
}

export default isAuth;