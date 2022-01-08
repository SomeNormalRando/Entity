"use strict";
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { env: { TOKEN, GUILD_WHITELIST }, Constants: { RESET_ESCAPE_CODE } } = require("../index");
const readyMsg = `
█▀▀ █▄ █ ▀█▀ █ ▀█▀ █▄█   █ █▀   █▀█ █▀▀ █▀█ █▀▄ █▄█
██▄ █ ▀█  █  █  █   █    █ ▄█   █▀▄ ██▄ █▀█ █▄▀  █\
`;

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		process.stdout.write(RESET_ESCAPE_CODE);

		// Determine whether to register commands or not based on argv
		if (process.argv.includes("r") || process.argv.includes("register")) {
			const global = process.argv.includes("g") || process.argv.includes("global");

			const registerType = global === true ? "global" : "guild";
			console.log(`\x1b[34mStarted reloading ${registerType} commands.\x1b[00m`);

			try {
				// Wait for every command to finish registering
				const result = await Promise.all(
					reloadCommands(client.user.id, global, client.commands)
				);

				console.log(`\x1b[34mSuccessfully reloaded ${registerType} commands${global === true ? "" : ` in ${result.length} guilds`}.\x1b[00m\n`);
			} catch (err) {
				console.error(`\x1b[1;91mError while reloading ${registerType} commands:\x1b[0m`, err);
				console.log("Commands:\n", client.commands);
			}
		}

		// Log messages on ready
		console.log(`\x1b[3;92mLogged in as ${client.user.tag}.\x1b[0m\n\x1b[94m${readyMsg}\x1b[0m\n`);
	}
};
function reloadCommands(userId, global, commands) {
	const results = [];
	if (global === true) {
		commands = commands.filter(cmd => cmd.global !== false);
	}
	commands = commands.map(cmd => cmd.data);

	const rest = new REST({ version: "9" }).setToken(TOKEN);

	if (global === true) {
		// Global commands
		results.push(rest.put(
			Routes.applicationCommands(userId),
			{ body: commands },
		));
	} else {
		// Guild commands
		const guildWhitelist = Array.from(GUILD_WHITELIST);
		for (const guildId of guildWhitelist) {
			results.push(rest.put(
				Routes.applicationGuildCommands(userId, guildId),
				{ body: commands },
			));
		}
	}

	return results;
}
