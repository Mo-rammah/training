import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//database imports.
import sequelize from './util/database.js';
import User from './models/users.js'; //will use later for realtions.
import { ensureDbExists } from './util/db-init.js'
await ensureDbExists();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

import adminRoutes from './routes/admin.js';

app.use(adminRoutes);

app.get('/', (req, res) => {
    res.render('pages/index', {
        title: "Training",
    })
});

const PORT = 3000;
sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on http://localhost:${PORT}/`);
    });
});
