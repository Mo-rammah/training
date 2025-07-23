import express from 'express';
import path from 'path';
import { title } from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
res.render('index', {
    title: "Training",
    })
})

const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`server is running on localhost:${PORT}`);
}) ;