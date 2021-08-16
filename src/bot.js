"use strict";
// Require needed modules
const Discord = require("discord.js");
const fs = require("fs");
const { client, token } = require("./index.js");

client.cooldowns = new Discord.Collection();

// Command handling
client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync("./slashcommands");
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./slashcommands/${folder}`).filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const command = require(`./slashcommands/${folder}/${file}`);
		client.commands.set(command.data.name, command);
	}
}
const contextMenuFolders = fs.readdirSync("./contextmenus");
for (const folder of contextMenuFolders) {
	const commandFiles = fs.readdirSync(`./contextmenus/${folder}`).filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const contextMenu = require(`./contextmenus/${folder}/${file}`);
		contextMenu.type = folder.toUpperCase();
		client.commands.set(contextMenu.name, contextMenu);
	}
}

// Event handling
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// Login
client.login(token);
// Unhandled promise rejection handling
process.on("unhandledRejection", error => {
	console.error("Unhandled promise rejection:", error);
});