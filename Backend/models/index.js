const {Sequelize}  = require("sequelize");
const pg = require('pg');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg,
  protocol: 'postgres',
  dialectOptions: {}
});

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./users.model.js')(sequelize, Sequelize);
db.works = require('./works.model.js')(sequelize, Sequelize);
db.categories = require('./categories.model.js')(sequelize, Sequelize);

// Works and Categories Relationships
db.categories.hasMany(db.works, {as: "works"})
db.works.belongsTo(db.categories, {
	foreignKey: 'categoryId',
	as: 'category'
});

// Works and Users Relationships
db.users.hasMany(db.works, {as: "works"})
db.works.belongsTo(db.users, {
	foreignKey: 'userId',
	as: 'user'
});

module.exports = db;
