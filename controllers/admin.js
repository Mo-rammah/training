import path from 'path';
import fs from 'fs';
import multer from 'multer'
import { fileURLToPath } from 'url';
import User from '../models/users.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + file.originalname)
    }
});
//limit file type:
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter
});


/// route functions: 
const getUpload = (req, res) => {
    res.render('pages/upload', {
        title: 'Upload a file',
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
    })
};

const postUpload = (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).render('pages/error', { message: 'File is too large, Size limit is 10MB', title: 'error', isLoggedIn: req.session.isLoggedIn, user: req.session.user, });
            }
            return res.status(400).render('pages/error', { message: err.message, title: 'error', isLoggedIn: req.session.isLoggedIn, user: req.session.user, });
        }
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        //res.json(req.file);
        res.redirect('/');
        console.log(`file uploaded to: ${req.file.destination}, file name is: ${req.file.filename}`);
    });
};


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
    getUpload,
    postUpload,
    getLogin,
    postLogin,
    getRegister,
    postRegister,
    postLogout,
}