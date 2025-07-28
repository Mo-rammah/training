import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import multer from 'multer'
import { error } from 'console';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index', {
        title: "Training",
    })
});

app.post('/upload', (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).send('File too large. Max size is 10MB.');
            }
            return res.status(400).send(err.message);
        }
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        res.json(req.file);
        console.log(`file uploaded to: ${req.file.destination}, file name is: ${req.file.filename}`);
    });
});


app.get('/upload', (req, res) => {
    res.render('upload', {
        title: "upload",
    });
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server is running on localhost:${PORT}`);
});