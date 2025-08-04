import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { checkAuth } from './middleware/is-logged-in.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//session
import sequelize from './util/database.js';
import sessionPkg from 'express-session';
const session = sessionPkg.default || sessionPkg;

import connectSessionSequelize from 'connect-session-sequelize';
const SequelizeStore = connectSessionSequelize(session.Store);

const sessionStore = new SequelizeStore({
    db: sequelize,
});

//database imports.
import User from './models/users.js'; //will use later for relations.
import { ensureDbExists } from './util/db-init.js'
await ensureDbExists();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(checkAuth);


import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';

app.use(authRoutes);
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
