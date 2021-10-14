"use strict";
// Require needed modules
const Discord = require("discord.js");
const fs = require("fs");
const { client, env } = require("./index");

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

// Command handling
const commandFolders = fs.readdirSync("./commands");
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		// @ts-expect-error
		command.data = Discord.ApplicationCommandManager.transformCommand(command.data);
		client.commands.set(command.data.name, command);
	}
}
const contextMenuFolders = fs.readdirSync("./contextmenus");
for (const folder of contextMenuFolders) {
	const commandFiles = fs.readdirSync(`./contextmenus/${folder}`).filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const contextMenu = require(`./contextmenus/${folder}/${file}`);
		const type = folder.toUpperCase();
		contextMenu.data = { name: contextMenu.name };
		if (type === "USER") {
			contextMenu.data.type = 2;
		} else if (type === "MESSAGE") {
			contextMenu.data.type = 3;
		}
		delete contextMenu.name;
		client.commands.set(contextMenu.data.name, contextMenu);
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
client.login(env.TOKEN);
// Unhandled promise rejection handling
process.on("unhandledRejection", error => {
	console.error("Unhandled promise rejection:", error);
});
