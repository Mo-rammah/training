import User from '../models/users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const getLogin = (req, res) => {
    res.render('admin/login', {
        title: "Login",
    });
};

const postLogin = async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
        const PasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (PasswordMatch) {
            console.log('user found logging in');
            const accesstoken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );
            const refreshToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            await user.update({ refreshToken });

            res.cookie('token', accesstoken, { httpOnly: true });
            res.cookie('refreshToken', refreshToken, { httpOnly: true });
            return res.redirect('/');
        }
    }

    // you are here if no user was found or password didn't match
    console.log("Incorrect email or password");
    res.redirect('/login');
};

const getRegister = (req, res) => {
    res.render('admin/register', {
        title: "Register",
    });
};
const postRegister = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (user) {
            return res.render('pages/error', {
                title: "Error: user already exists",
                message: 'This user already exists, please log in or enter a new email.',
                isLoggedIn: req.session.isLoggedIn,
                user: req.session.user
            });
        }

        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 12)
        });
        res.redirect('/login');
    } catch (err) {
        console.error(err);
    }
};

const postLogout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
    });
    res.redirect('/');
}

export default {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
    postLogout,
}