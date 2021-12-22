"use strict";
const fs = require("fs");
const { Util: { SlashCommand }, env: { OWNERS, GUILD_WHITELIST } } = require("../../index");
module.exports = {
	data: new SlashCommand({
		name: "reload",
		description: "[Dev-only command]",
		options: [
			{
				name: "command",
				description: "Command to reload",
				type: "STRING",
				autocomplete: true,
				required: true
			},
			{
				name: "re-register",
				description: "Whether to re-register the command(s)",
				type: "BOOLEAN",
				required: false
			},
			{
				name: "global",
				description: "Whether to re-register the command(s) globally or not (only works if re-register is true)",
				type: "BOOLEAN",
				required: false
			}
		],
	}),
	global: false,
	async execute(interaction, args) {
		if (!OWNERS.includes(interaction.member.id)) return interaction.reply({ content: "You can't use this command.", ephemeral: true });
		await interaction.deferReply();

		const { client } = interaction;
		const cmdName = args.command;

		const command = client.commands.get(cmdName);
		if (!command) return interaction.editReply({ content: `Command \`${cmdName}\` not found.`, ephemeral: true });

		const commandFolders = fs.readdirSync("./commands");

		const folderName = commandFolders.find(
			folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.data.name}.js`)
		);

		try {
			delete require.cache[require.resolve(`../${folderName}/${command.data.name}.js`)];

			const newCommand = require(`../${folderName}/${command.data.name}.js`);
			client.commands.set(newCommand.data.name, newCommand);

			await interaction.editReply(`Command \`${cmdName}\` successfully reloaded.`);

			if (args["re-register"] === true) {
				const reply = `Command \`${cmdName}\` successfully re-registered`;

				// Global
				if (args.global === true) {
					const appCommands = client.application.commands;
					appCommands.fetch().then(result => {
						for (const cmd of result.values) {
							if (cmd.name === command.data.name) {
								appCommands.edit(cmd.id, newCommand.data);
								break;
							}
						}
						interaction.followUp(`${reply} globally.`);
					});
				// Guild
				} else {
					const guildWhitelist = Array.from(GUILD_WHITELIST);
					const guildPromises = [];
					const cmdPromises = [];
					for (const guildId of guildWhitelist) {
						const guildCommands = client.guilds.cache.get(guildId).commands;

						guildPromises.push(guildCommands.fetch().then(result => {
							for (const cmd of result.values()) {
								if (cmd.name === command.data.name) {
									cmdPromises.push(guildCommands.edit(cmd.id, newCommand.data));
									break;
								}
							}
						}));
					}
					await Promise.all(guildPromises);
					Promise.all(cmdPromises).then(arr => {
						const guilds = arr.map(cmd => cmd.guildId);
						interaction.followUp(`${reply} in ${guilds.length} guilds (${guilds.join(", ")}).`);
					});
				}
			}
		} catch (err) {
			console.error(err);
			// eslint-disable-next-line prefer-template
			const stringified = "```" + err.toString() + "```";
			await interaction.editReply({
				content: `An error occurred while reloading command \`${command.data.name}\`:\n${stringified}`,
				ephemeral: true
			});
		}
	},
	autocomplete(interaction) {
		const selected = interaction.options.getString("command");
		// Get commands that match
		const matches = interaction.client.commands.filter(e => e.data.name.startsWith(selected));

		// Map to choice object
		return matches.map(e => ({ name: e.data.name, value: e.data.name }));
	}
};
