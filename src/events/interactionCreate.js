"use strict";
const Discord = require("discord.js");
module.exports = {
	name: "interactionCreate",
	once: false,
	/**
	 * @param {Discord.Interaction} interaction
	 * @param {Discord.Client} client
	 */
	async execute(interaction, client) {
		// Slash commands
		if (interaction.isCommand()) {
			if (!client.commands.has(interaction.commandName)) return;
			const command = client.commands.get(interaction.commandName);
			const commandName = command.data.name;

			// Guild-only command handling
			if ((command.guildOnly === true || command.guildOnly?.[0] === true) && !interaction.inGuild()) {
				return interaction.reply(command.guildOnly?.[1] || "This command can only be used in a server.");
			}

			// User permissions
			if (command.userPerms) {
				// @ts-expect-error
				const userPerms = interaction.channel.permissionsFor(interaction.member);
				const missingPerms = [];
				for (const element of command.userPerms) {
					if (!userPerms.has(command.userPerms)) {
						missingPerms.push(Discord.Formatters.inlineCode(element.toTitleCase(/VAD/i, /TTS/i)));
					}
				}
				if (missingPerms.length) {
					return interaction.reply({
						content: `You still need the permission(s) ${missingPerms.join(" ")} to use this command.`,
					});
				}
			}

			// Cooldowns
			const { cooldowns } = client;
			if (!cooldowns.has(commandName)) {
				cooldowns.set(commandName, new Discord.Collection());
			}
			const userId = interaction.member.user.id;
			const now = Date.now();
			const timestamps = cooldowns.get(commandName);
			const cooldownAmount = (command.cooldown || 1) * 1000;

			if (timestamps.has(userId)) {
				const expirationTime = timestamps.get(userId) + cooldownAmount;

				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return interaction.reply({
						// eslint-disable-next-line max-len
						content: `Please wait ${timeLeft.toFixed(1)} more second${timeLeft === 1 ? "" : "s"} before reusing the command \`${commandName}\`.`,
						ephemeral: true
					});
				}
			}
			timestamps.set(userId, now);
			setTimeout(() => timestamps.delete(userId), cooldownAmount);

			// Args
			const args = {};
			if (command.data.options) {
				for (const element of command.data.options) {
					const { type } = element;
					/** @type {*} */
					let optionVal = interaction.options.get(element.name)?.value;
					if (!optionVal) continue;
					if (type === 6) {
						optionVal = interaction.options.getMember(element.name);
					} else if (type === 7) {
						optionVal = interaction.options.getChannel(element.name);
					} else if (type === 8) {
						optionVal = interaction.options.getRole(element.name);
					} else if (type === 9) {
						optionVal = interaction.options.getMentionable(element.name);
					}
					args[element.name] = optionVal;
				}
				args.subcommand = interaction.options.getSubcommand(false);
				args.subcommandGroup = interaction.options.getSubcommandGroup(false);
			}

			// Executing and error handling
			try {
				await command.execute(interaction, args);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: "An error occurred while executing this command.", ephemeral: true }).catch(err => {
					if (err.message !== "INTERACTION_ALREADY_REPLIED") console.error(err);
					interaction.followUp({ content: "An error occurred while executing this command.", ephemeral: true });
				});
			}

		// Context menus
		} else if (interaction.isContextMenu()) {

			if (!client.commands.has(interaction.commandName)) return;

			const command = await client.commands.get(interaction.commandName);

			const arg = interaction.targetType === "USER" ? interaction.options.getMember("user") : interaction.options.getMessage("message");

			try {
				await command.execute(interaction, arg);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: "An error occurred while executing this command.", ephemeral: true }).catch(err => {
					console.error(err);
					interaction.followUp({ content: "An error occurred while executing this command.", ephemeral: true })
						.catch(err => console.error(err));
				});
			}
		}
	}
};
