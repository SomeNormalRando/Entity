"use strict";
const { Collection, Formatters, MessageEmbed } = require("discord.js");
const {
	Constants: { errorEmojis, errorSep, EMBED_COLOUR },
	Util: { createErrorEmbed, toTitleCase, addS },
	config: { MAX_CHOICE_LENGTH }
} = require("../index");
module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction, client) {
		// Slash commands
		if (interaction.isCommand()) {
			if (!client.commands.has(interaction.commandName)) {
				return interaction.reply({ embeds: [
					new MessageEmbed()
						.setTitle(`Sorry, this command is not currently implemented ${errorEmojis.random()}`)
						.setDescription("It might be temporarily disabled. Please check back again in the future.")
				] });
			}

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
						.setTitle("You don't have the required permissions")
						.setColor(EMBED_COLOUR)
						.setDescription(`You still need the permission${addS(missingPerms.length)} ${missingPerms.join(" ")} to use this command.`);
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
						content: `Please wait ${timeLeft.toFixed(1)} more second${addS(timeLeft)} before reusing the command \`${commandName}\`.`,
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
				console.error(`${errorSep}\n\x1b[91mError at command \`${commandName}\`:\x1b[0m`, err, `\n${errorSep}`);

				const reply = { embeds: [createErrorEmbed()], ephemeral: true };
				if (interaction.replied || interaction.deferred) interaction.followUp(reply);
				else interaction.reply(reply);
			}
		// Autocomplete
		} else if (interaction.isAutocomplete()) {
			const command = client.commands.get(interaction.commandName);
			const commandName = command.data.name;

			if (!command.autocomplete) return console.log(`Autocomplete interaction received for command \`${commandName}\` but no autocomplete function was found.`);

			try {
				const result = await command.autocomplete(interaction);
				if (!Array.isArray(result)) return console.log(`Return value of autocomplete function for command \`${commandName}\` is not an array.`);

				// ? .slice is to limit the response to the max choice length
				await interaction.respond(result.slice(0, MAX_CHOICE_LENGTH));
			} catch (err) {
				console.error(`${errorSep}\n\x1b[91mError at autocomplete for command \`${commandName}\`:\x1b[0m`, err, `\n${errorSep}`);
			}

		// Context menus
		} else if (interaction.isContextMenu()) {
			if (!client.commands.has(interaction.commandName)) {
				return interaction.reply({ embeds: [
					new MessageEmbed()
						.setTitle(`Sorry, this command is not currently implemented ${errorEmojis.random()}`)
						.setDescription("It might be temporarily disabled. Please check back again in the future.")
				] });
			}

			const command = await client.commands.get(interaction.commandName);

			const arg = interaction.targetType === "USER"
				? interaction.options.getMember("user")
				: interaction.options.getMessage("message");

			try {
				await command.execute(interaction, arg);
			} catch (err) {
				error(`context menu \`${interaction.commandName}\``, err);
				const reply = { embeds: [createErrorEmbed()], ephemeral: true };
				if (interaction.replied || interaction.deferred) interaction.followUp(reply);
				else interaction.reply(reply);
			}
		}
	}
};
/**
 * @example error("command `testing`", new Error("Testing!"))
 * // Will log the below (coloured) to stderr
 * // ──────────────────────────────────────────────────
 * // Error at command `testing`: Error: Testing!
 * //     at testing.js:1:1
 * //     ...etc
 * // ──────────────────────────────────────────────────
 */
function error(where, err) {
	console.error(`${errorSep}\n\x1b[91mError at ${where}: \x1b[0m${err}\n${errorSep}`);
}
