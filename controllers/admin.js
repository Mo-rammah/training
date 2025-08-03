import path from 'path';
import fs from 'fs';
import multer from 'multer'
import { fileURLToPath } from 'url';
import User from '../models/users.js';

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
const postLogin = (req, res) => {
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (user && user.password === req.body.password) {
                console.log('user found logging in');
                req.session.isLoggedIn = true;
                res.redirect('/');
            }
            else {
                console.log('Incorrect Email or password');
                res.redirect('/login');
            }
        }).catch(err => {
            console.log(err);
        })
};
const getRegister = (req, res) => {
    res.render('admin/register', {
        title: "Register",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
    });
};
const postRegister = (req, res) => {
    console.log(req.body)
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    User.create({ username: username, email: email, password: password })
        .then(() => {
            res.redirect('/');
        }).catch(err => {
            console.log(err);
        })

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