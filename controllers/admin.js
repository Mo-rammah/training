import path from 'path';
import fs from 'fs';
import multer from 'multer'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
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

export default {
    getUpload,
    postUpload,
}