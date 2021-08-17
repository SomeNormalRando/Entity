const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { config } = require("../index.js");
module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		// Register commands
		const commands = [];
		const commandFolders = fs.readdirSync("./slashcommands");
		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`./slashcommands/${folder}`).filter(file => file.endsWith(".js"));
			for (const file of commandFiles) {
				const command = require(`../slashcommands/${folder}/${file}`);
				commands.push(command.data);
			}
		}
		const guildWhitelist = Array.from(config.guildWhitelist);
		// (async function() {
		// 	for (const element of guildWhitelist) {
		// 		const guild = await client.guilds.cache.get(element);
		// 		guild.commands.set(commands);
		// 	}
		// }()).then(console.log("Commands registered.")).catch(err => console.error(err));

		const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

		(async () => {
			try {
				console.log("Started reloading commands.");
				for (const guildId of guildWhitelist) {
					await rest.put(
						Routes.applicationGuildCommands(client.user.id, guildId),
						{ body: commands },
					);
				}

				console.log("Succesfully reloaded commands.");
			} catch (error) {
				console.error(error);
			}
		})();
		// Log message when everything is done
		console.log(`Bot ready, logged in as ${client.user.tag}.`);
	},
};