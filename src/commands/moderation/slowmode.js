"use strict";
const Discord = require("discord.js");
const { Util: { SlashCommand, addS }, Constants: { EMBED_COLOUR } } = require("../../index");
const MAX_SLOWMODE_DURATION = 21600;
module.exports = {
	data: new SlashCommand({
		name: "slowmode",
		description: "Set the slowmode for a channel",
		options: [
			{
				name: "interval",
				description: "The slowmode interval (in seconds)",
				type: "INTEGER",
				required: true
			},
			{
				name: "channel",
				description: "The channel to set the slowmode for (defaults to the current channel)",
				type: "CHANNEL",
				channelTypes: [0],
				required: false
			},

		]
	}),
	guildOnly: true,
	userPerms: ["MANAGE_CHANNELS"],
	execute(interaction, args) {
		const channel = args.channel || interaction.channel;

		const embed = new Discord.MessageEmbed().setColor(EMBED_COLOUR);

		// User permission check
		if (!channel.permissionsFor(interaction.member).has("MANAGE_CHANNELS")) {
			embed.setTitle("You don't have sufficient permissions")
				.setDescription(`You don't have the permission Manage Channel in ${channel.toString()}.`);
		}

		// Bot permission check
		if (!channel.permissionsFor(interaction.guild.me).has("MANAGE_CHANNELS")) {
			embed.setTitle("I don't have sufficient permissions")
				.setDescription("I need the Manage Channel permission to set the slowmode of a channel.");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		const interval = interaction.options.getInteger("interval");
		if (interval < 0 || interval > MAX_SLOWMODE_DURATION) {
			embed.setTitle("Invalid slowmode duration")
				.setDescription("It must be between 0 and 21600 seconds, inclusive.");
			return interaction.reply({ embeds: [embed] });
		}

		channel.setRateLimitPerUser(interval, `${interaction.user.username} used /slowmode`)
			.then(textChannel => {
				embed.setDescription(
					`Slowmode for ${textChannel.toString()} successfully set to ${interval.toString()} second${addS(interval)}.`
				);
				interaction.reply({ embeds: [embed] });
			})
			.catch(err => {
				console.error(err);
				embed.setTitle("An error occurred");
				embed.setDescription("Did you enter an invalid slowmode duration? It must be between 0 and 21600 seconds, inclusive.");
				interaction.reply({ embeds: [embed], ephemeral: true });
			});
	}
};
