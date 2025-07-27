import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import multer from 'multer'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + file.originalname)
    }
});
const upload = multer({ storage: storage });

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

app.post('/upload', upload.single('image'), (req, res) => {
    res.json(req.file);
    console.log(`file uploaded to: ${req.file.destination}, file name is: ${req.file.filename}`);
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