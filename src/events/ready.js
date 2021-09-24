"use strict";
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { env } = require("../index.js");
module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		/* Register commands */
		const commands = [];

		// Toggle to register global commands or guild commands
		const registerGlobal = process.argv.includes("g") || process.argv.includes("global");
		const clearCommands = !process.argv.includes("c") || !process.argv.includes("clear");

		if (clearCommands) {
			if (registerGlobal) {
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
			if (registerGlobal === true) {
				// Global commands
				console.log("Started reloading global commands.");
				await rest.put(
					Routes.applicationCommands(client.user.id),
					{ body: commands },
				);
			} else {
				// Guild commands
				const guildWhitelist = Array.from(env.guildWhitelist);
				console.log("Started reloading guild commands.");
				for (const guildId of guildWhitelist) {
					/* eslint-disable-next-line no-await-in-loop */
					await rest.put(
						Routes.applicationGuildCommands(client.user.id, guildId),
						{ body: commands },
					);
				}
			}
			console.log("Succesfully reloaded commands.");
		} catch (error) {
			console.error(error);
		}

		/* Log message when everything is done */
		console.log(`Bot logged in as ${client.user.tag}.\n`);

		console.log("█▀▀ █▄ █ ▀█▀ █ ▀█▀ █▄█   █ █▀   █▀█ █▀▀ █▀█ █▀▄ █▄█");
		console.log("██▄ █ ▀█  █  █  █   █    █ ▄█   █▀▄ ██▄ █▀█ █▄▀  █ \n");
	},
};
