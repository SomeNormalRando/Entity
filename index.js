//Require modules
const Discord = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config()

//Create a new Discord client
const client = new Discord.Client( { disableMentions: 'everyone'} );

//Global variables
const { userWhitelist, guildWhitelist} = require('./config.json');
const {	getPrefix } = require('./dbindex.js')
const countingNumberFile = require('./countingNumber.json');
client.cooldowns = new Discord.Collection();
let countingNumber = parseInt(JSON.parse(countingNumberFile.number), 10);


//Command handling
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		command.category = folder;
		client.commands.set(command.name, command);
	}
}

//Event handling
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

//Login
client.login(process.env.TOKEN);

//Functions
const getUserfromMention = function(mention) {
	const matches = mention.match(/^<@!?(\d+)>$/);

	if (!matches) return;

	const id = matches[1];

	return client.users.cache.get(id);
}