const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { config } = require("../index.js");
module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		// Register commands
		const commands = [];

		// Toggle to register global commands or guild commands
		const registerGlobal = process.argv.includes("g") || process.argv.includes("global");

		if (!process.argv.includes("c")) {
			if (registerGlobal) {
				client.commands.each((cmd) => {
					if (!cmd.beta && !cmd.noRegister) commands.push(cmd.data);
				});
			} else {
				client.commands.each((cmd) => {
					if (!cmd.noRegister) commands.push(cmd.data);
				});
			}
		}

		const guildWhitelist = Array.from(config.guildWhitelist);
		const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);


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
				console.log("Started reloading guild commands.");
				for (const guildId of guildWhitelist) {
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
		// Log message when everything is done
		console.log(`Bot ready, logged in as ${client.user.tag}.`);
	},
};