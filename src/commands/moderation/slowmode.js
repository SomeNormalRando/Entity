"use strict";
const Discord = require("discord.js");
const { Util: { SlashCommand } } = require("../../index");
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

		const embed = new Discord.MessageEmbed();

		// User permission check
		if (!channel.permissionsFor(interaction.member).has("MANAGE_CHANNELS")) {
			embed.setTitle("You don't have sufficient permissions");
			embed.setDescription(`You don't have the ${Discord.Formatters.inlineCode("MANAGE_CHANNELS")} permission in ${channel.toString()}.`);
		}

		// Bot permission check
		if (!channel.permissionsFor(interaction.guild.me).has("MANAGE_CHANNELS")) {
			embed.setTitle("I don't have sufficient permissions");
			embed.setDescription("I need the permission `MANAGE_CHANNELS` to set the slowmode of a channel.");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		channel.setRateLimitPerUser(args.interval, `${interaction.user.username} used /slowmode`)
			.then(textChannel => {
				embed.setDescription(
					`Slowmode for ${textChannel.toString()} successfully set to ${args.interval} ${args.interval === 1 ? "second" : "seconds"}.`
				);
				interaction.reply({ embeds: [embed] });
			})
			.catch(err => {
				console.error(err);
				embed.setTitle("An error occured");
				embed.setDescription("Are you sure you selected a text channel?");
				interaction.reply({ embeds: [embed], ephemeral: true });
			});
	}
};
