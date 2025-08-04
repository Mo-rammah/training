import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, 'root', process.env.DB_PASS, { dialect: 'mysql' });

export default sequelize;