const Sequelize = require('sequelize');

//Connection information
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

//Models

//Tags
const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		//unique: true,
	},
	content: Sequelize.TEXT,
	createdBy: Sequelize.STRING,
	updatedBy: Sequelize.STRING,
	guild: Sequelize.STRING,
});

//Exports
module.exports = {
	sequelize: sequelize,
	Tags: Tags
}