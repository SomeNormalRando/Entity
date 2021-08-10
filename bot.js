//Require needed modules
const Discord = require('discord.js');
const fs = require('fs');
const { client, token } = require('./index.js');

client.cooldowns = new Discord.Collection();

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

//Slash command handling
client.slashCommands = new Discord.Collection();
const slashCommandFolders = fs.readdirSync('./slashcommands');
for (const folder of slashCommandFolders) {
	const commandFiles = fs.readdirSync(`./slashcommands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./slashcommands/${folder}/${file}`);
		client.slashCommands.set(command.name, command);
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

//Unhandled promise rejection handling
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

//Login
client.login(token);