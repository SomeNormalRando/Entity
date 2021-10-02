"use strict";
const fs = require("fs");
const { Util: { SlashCommand } } = require("../../index");
const { env } = require("../../index");
module.exports = {
	data: new SlashCommand({
		name: "reload",
		description: "[Dev-only command]",
		options: [
			{
				name: "command",
				description: "Command to reload",
				type: "STRING",
				// autocomplete: true,
				required: true
			},
			{
				name: "reregister",
				description: "Whether to reregister the command(s)",
				type: "BOOLEAN",
				required: false
			},
			{
				name: "global",
				description: "Whether to reregister the command(s) globally or not (only works if reregister is true)",
				type: "BOOLEAN",
				required: false
			}
		],
	}),
	indev: true,
	async execute(interaction, args) {
		if (!env.OWNERS.includes(interaction.member.id)) return interaction.reply({ content: "You can't use this command.", ephemeral: true });
		await interaction.deferReply();

		const client = interaction.client;
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

			if (args.reregister === true) {
				const reply = `Command \`${cmdName}\` successfully re-registered.`;

				// Global
				if (args.global === true) {
					const appCommands = client.application.commands;
					appCommands.fetch().then(result => {
						for (const cmd of result.values) {
							if (cmd.name === command.data.name) {
								appCommands.edit(cmd.id, newCommand.data);
								break;
							}
						}interaction.followUp(reply);
					});
				// Guild
				} else {
					const guildWhitelist = Array.from(env.GUILD_WHITELIST);
					for (const guildId of guildWhitelist) {
						const guildCommands = client.guilds.cache.get(guildId).commands;

						guildCommands.fetch().then(result => {
							for (const cmd of result.values()) {
								if (cmd.name === command.data.name) {
									guildCommands.edit(cmd.id, newCommand.data);
									break;
								}
							}
						});
					}
					interaction.followUp(reply);
				}
			}
		} catch (err) {
			console.error(err);
			const stringified = require("discord.js").Formatters.codeBlock(err.toString());
			await interaction.editReply({
				content: `An error occurred while reloading command \`${command.data.name}\`:\n${stringified}`,
				ephemeral: true
			});
		}
	}
};
