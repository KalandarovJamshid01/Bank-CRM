const dbConfig = require('./../config/dbConfig');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  dbConfig.db,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorAliases: false,
  }
);

const users = require('./user');
const rates = require('./rate');
sequelize
  .authenticate()
  .then(() => {
    console.log(`${dbConfig.db} DB connected`);
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = users(sequelize, DataTypes);
db.rates = rates(sequelize, DataTypes);

db.rates.belongsTo(db.users);
db.users.hasMany(db.rates);
db.sequelize.sync({ force: false }).then(() => {
  console.log('yes re-sync done!');
});

module.exports = db;
