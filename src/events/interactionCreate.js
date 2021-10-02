"use strict";
const Discord = require("discord.js");
const { Util } = require("../index.js");
module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction, client) {
		// If interaction is a slash command
		if (interaction.isCommand()) {

			if (!client.commands.has(interaction.commandName)) return;

			const command = await client.commands.get(interaction.commandName);

			if (command.guildOnly === true && !interaction.inGuild()) return interaction.reply("This command can only be used in a server.");

			if (command.userPerms) {
				const userPerms = interaction.channel.permissionsFor(interaction.member);
				const missingPerms = [];
				for (const element of command.userPerms) {
					if (!userPerms.has(command.userPerms)) missingPerms.push(Discord.Formatters.inlineCode(Util.normalizeStr(element)));
				}
				if (missingPerms.length) {
					return interaction.reply({
						content: `You still need the permission(s) ${missingPerms.join(" ")} to use this command.`,
						ephemeral: true
					});
				}
			}

			const args = {};
			if (command.data.options) {
				for (const element of command.data.options) {
					const { type } = element;
					let optionVal = interaction.options.get(element.name);
					if (!optionVal) continue;
					// Type 6 is type USER
					if (type === 6) {
						optionVal = interaction.options.getMember(element.name);
					// Type 7 is type CHANNEL
					} else if (type === 7) {
						optionVal = interaction.options.getChannel(element.name);
					} else {
						optionVal = optionVal.value;
					}
					args[element.name] = optionVal;
				}
				const subcommand = interaction.options.getSubcommand(false);
				if (subcommand) args.subcommand = subcommand;
			}
			try {
				await command.execute(interaction, args);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: "An error occured while executing this command.", ephemeral: true }).catch(err => {
					console.error(err);
					interaction.followUp({ content: "An error occured while executing this command.", ephemeral: true });
				});
			}
		// If interaction is a context menu
		} else if (interaction.isContextMenu()) {

			if (!client.commands.has(interaction.commandName)) return;

			const command = await client.commands.get(interaction.commandName);

			if (command.guildOnly === true && interaction.channel.type === "dm") {
				return interaction.reply("This command can only be used in a server.");
			}

			if (command.userPerms) {
				const userPerms = interaction.channel.permissionsFor(interaction.member);
				const missingPerms = [];
				for (const element of command.userPerms) {
					if (!userPerms.has(command.userPerms)) missingPerms.push(Discord.Formatters.inlineCode(Util.normalizeStr(element)));
				}
				if (missingPerms.length) {
					return interaction.reply({
						content: `You still need the permission(s) ${missingPerms.join(" ")} to use this command.`,
						ephemeral: true
					});
				}
			}

			const args = interaction.targetType === "USER" ? interaction.options.getMember("user") : interaction.options.getMessage("message");

			try {
				await command.execute(interaction, args);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: "An error occured while executing this command.", ephemeral: true }).catch(err => {
					console.error(err);
					interaction.followUp({ content: "An error occured while executing this command.", ephemeral: true })
						.catch(err => console.error(err));
				});
			}
		}
	},
};
