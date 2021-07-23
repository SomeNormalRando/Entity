const Sequelize = require('sequelize');
const { defaultPrefix } = require('./config.json');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
})

const Prefixes = sequelize.define('prefixes', {
	guild: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true
	},
	prefix: Sequelize.STRING
})

module.exports = {
//Connection information
	sequelize: sequelize,
//Models
	//Tags
	Tags: 
		sequelize.define('tags', {
			name: {
				type: Sequelize.STRING,
				//unique: true,
			},
			content: Sequelize.TEXT,
			createdBy: Sequelize.STRING,
			updatedBy: Sequelize.STRING,
			guild: Sequelize.STRING,
		}),

	//Prefixes
	Prefixes: Prefixes,
	getPrefix: async function(guildID) {
		const prefix = await Prefixes.findOne({ where: { guild: guildID } })
		return prefix?.prefix ?? defaultPrefix;
	},
	Counting:
		sequelize.define('counting', {
			channel: {
				type: Sequelize.STRING,
				unique: true,
				primaryKey: true,
			},
			number: Sequelize.INTEGER
		})
}