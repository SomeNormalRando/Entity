"use strict";
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { env } = require("../index");
module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		// Whether to register commands or not
		if (process.argv.includes("r") || process.argv.includes("register")) {
			const global = process.argv.includes("g") || process.argv.includes("global");
			const clear = process.argv.includes("c") || process.argv.includes("clear");
			reloadCommands(client, global, clear);
		}

		// Log message on ready
		console.log("█▀▀ █▄ █ ▀█▀ █ ▀█▀ █▄█   █ █▀   █▀█ █▀▀ █▀█ █▀▄ █▄█");
		console.log("██▄ █ ▀█  █  █  █   █    █ ▄█   █▀▄ ██▄ █▀█ █▄▀  █ \n");

		console.log(`Logged in as ${client.user.tag}.`);
	}
};
/**
 * Registers commands to the Discord API
 * @param {import("discord.js").Client} client The client to register commands for
 * @param {Boolean} [global=false] Whether to register the commands globally
 * @param {Boolean} [clear=false] Whether to overwrite the commands with an empty array
 */
function reloadCommands(client, global, clear) {
	const commands = [];
	const registerType = global === true ? "global" : "guild";
	console.log(`Started reloading ${registerType} commands.`);

	if (clear !== true) {
		if (global === true) {
			client.commands.each(cmd => {
				if (!cmd.indev && !cmd.dontRegister) commands.push(cmd.data);
			});
		} else {
			client.commands.each(cmd => {
				if (!cmd.dontRegister) commands.push(cmd.data);
			});
		}
	}

	const rest = new REST({ version: "9" }).setToken(env.TOKEN);

	try {
		if (global === true) {
			// Global commands
			rest.put(
				Routes.applicationCommands(client.user.id),
				{ body: commands },
			);
		} else {
			// Guild commands
			const guildWhitelist = Array.from(env.GUILD_WHITELIST);
			for (const guildId of guildWhitelist) {
				rest.put(
					Routes.applicationGuildCommands(client.user.id, guildId),
					{ body: commands },
				);
			}
		}
		console.log(`Successfully reloaded ${registerType} commands.\n`);
	} catch (error) {
		console.error(error);
	}
}
