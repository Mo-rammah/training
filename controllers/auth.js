import User from '../models/users.js';
import bcrypt from 'bcryptjs';

const getLogin = (req, res) => {
    res.render('admin/login', {
        title: "Login",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
    });
};

const postLogin = async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
        const PasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (PasswordMatch) {
            console.log('user found logging in');
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
                if (err) {
                    console.error('Session save error:', err);
                }
                res.redirect('/');
            });
        }
    }

    // you are here if no user was found or password didn't match

    console.log("Incorrect email or password");
    res.redirect('/');
};

const getRegister = (req, res) => {
    res.render('admin/register', {
        title: "Register",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
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
    req.session.destroy(() => {
        res.redirect('/');
    })
}


export default {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
    postLogout,
}