const Sequelize = require('sequelize');
const OTP_Model = require('./models/OTP');
const User_Model = require('./models/USER');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql', // Utilisation de MySQL
  define: {
    timestamps: false
  },
  pool: {
    max: 20,
    min: 0,
    idle: 5000
  },
  logging: false
});

const OTP = OTP_Model(sequelize, Sequelize);
const User = User_Model(sequelize, Sequelize);

sequelize.sync().then(() => {
  console.log('La base de données et les tables ont été créées');
});

module.exports = { OTP, User };
