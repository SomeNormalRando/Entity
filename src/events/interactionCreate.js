"use strict";
const { Collection, Formatters, MessageEmbed } = require("discord.js");
const { Util: { errSep }, Util: { createErrorEmbed, toTitleCase } } = require("../index");
module.exports = {
	name: "interactionCreate",
	once: false,
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
				const userPerms = interaction.channel.permissionsFor(interaction.member);
				const missingPerms = [...command.userPerms]
					.filter(e => !userPerms.has(e))
					.map(e => Formatters.inlineCode(toTitleCase(e, /VAD/i, /TTS/i)));

				if (missingPerms.length) {
					const embed = new MessageEmbed()
						.setTitle("You don't have enough permissions!")
						.setDescription(`You still need the permission(s) ${missingPerms.join(" ")} to use this command.`);
					return interaction.reply({ embeds: [embed] });
				}
			}

			// Cooldowns
			const { cooldowns } = client;
			if (!cooldowns.has(commandName)) {
				cooldowns.set(commandName, new Collection());
			}
			const userId = interaction.member.id;
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
			const args = { };
			if (command.data.options) {
				for (const element of command.data.options) {
					const { type } = element;
					let val = interaction.options.get(element.name)?.value;
					/* This works because `null == undefined`
						but `null != false`, `null != 0`, `null != ""` */
					if (val == null) continue;
					else if (type === 6) val = interaction.options.getMember(element.name);
					else if (type === 7) val = interaction.options.getChannel(element.name);
					else if (type === 8) val = interaction.options.getRole(element.name);
					else if (type === 9) val = interaction.options.getMentionable(element.name);

					args[element.name] = val;
				}
				args.subcommand = interaction.options.getSubcommand(false);
				args.subcommandGroup = interaction.options.getSubcommandGroup(false);
			}

			// Executing and error handling
			try {
				await command.execute(interaction, args);
			} catch (err) {
				console.error(`${errSep}\n\x1b[91mError at command \`${commandName}\`:\x1b[0m`, err, `\n${errSep}`);

				const reply = { embeds: [createErrorEmbed()], ephemeral: true };
				if (interaction.replied || interaction.deferred) interaction.followUp(reply);
				else interaction.reply(reply);
			}

		// Context menus
		} else if (interaction.isContextMenu()) {
			if (!client.commands.has(interaction.commandName)) return;

			const command = await client.commands.get(interaction.commandName);

			const arg = interaction.targetType === "USER"
				? interaction.options.getMember("user")
				: interaction.options.getMessage("message");

			try {
				await command.execute(interaction, arg);
			} catch (err) {
				console.error(`${errSep}\n\x1b[91mError at context menu \`${interaction.commandName}\`:\x1b[0m`, err, `\n${errSep}`);

				const reply = { embeds: [createErrorEmbed()], ephemeral: true };
				if (interaction.replied || interaction.deferred) interaction.followUp(reply);
				else interaction.reply(reply);
			}
		}
	}
};
