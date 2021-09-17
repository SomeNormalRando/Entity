"use strict";
// Require needed modules
const Discord = require("discord.js");
const fs = require("fs");
const { client, env } = require("./index.js");

client.cooldowns = new Discord.Collection();

// Command handling
client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync("./slashcommands");
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./slashcommands/${folder}`).filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const command = require(`./slashcommands/${folder}/${file}`);
		changeOptions(command.data);
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
		}
		else if (type === "MESSAGE") {
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

function changeOptions(cmd) {
	if (!Object.prototype.hasOwnProperty.call(cmd, "options")) return;
	for (let i = 0; i < cmd.options.length; i++) {
		const option = cmd.options[i];
		switch(option.type) {
			case "SUB_COMMAND":
				option.type = 1;
				changeOptions(option);
				break;
			case "SUB_COMMAND_GROUP":
				option.type = 2;
				changeOptions(option);
				break;
			case "STRING":
				option.type = 3;
				break;
			case "INTEGER":
				option.type = 4;
				break;
			case "BOOLEAN":
				option.type = 5;
				break;
			case "USER":
				option.type = 6;
				break;
			case "CHANNEL":
				option.type = 7;
				break;
			case "ROLE":
				option.type = 8;
				break;
			case "MENTIONABLE":
				option.type = 9;
				break;
			case "NUMBER":
				option.type = 10;
				break;
			default:
				throw new TypeError("Provided option type is not valid.");
		}
	}
}