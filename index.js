//Require Discord.js
const Discord = require('discord.js');

//Load token from the file .env into process
require('dotenv').config();

//Create a new Discord client
const client = new Discord.Client({
	//Intents
	intents: ['GUILDS', 'GUILD_MESSAGES'],
	//Status
	presence: { activities: [{ name:`${require('./config.json').defaultPrefix}help`, type: 'WATCHING' }] },
	//Allowed mentions
	allowedMentions: { repliedUser: false }
});

//Exports
module.exports = {
	client,
	token: process.env.TOKEN,
	config: require('./config.json'),
	Util: require('./assets/Util.js'),
};
