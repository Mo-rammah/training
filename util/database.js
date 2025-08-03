import Sequelize from 'sequelize';

const sequelize = new Sequelize('training', 'root', 'ZeroTwoPie3469', { dialect: 'mysql' });

export default sequelize;