import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
    const token = req.cookies.token;
    res.locals.isLoggedIn = false;
    res.locals.user = null;

    if (!token) return next();
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.isLoggedIn = true;
        res.locals.user = decoded;
    }
    catch (err) {
        console.log(err.name);
        return next();
    }
    next();
};