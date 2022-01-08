"use strict";
const { MessageEmbed, Formatters } = require("discord.js");
const { Util: { SlashCommand, createErrorEmbed }, Constants: { EMBED_COLOUR } } = require("../../index");
module.exports = {
	data: new SlashCommand({
		name: "timeout",
		description: "Time-out a user, temporarily preventing them from interacting with the server",
		options: [
			{
				name: "set",
				description: "Time-out a user, temporarily preventing them from interacting with the server",
				type: "SUB_COMMAND",
				options: [
					{
						name: "user",
						description: "The user to time-out",
						type: "USER",
						required: true
					},
					{
						name: "time",
						description: "The time (in minutes) to time-out the user",
						type: "INTEGER",
						required: true
					},
					{
						name: "reason",
						description: "The reason to time-out the user (shows up in the audit log)",
						type: "STRING",
						required: false
					}
				]
			},
			{
				name: "remove",
				description: "Remove a time-out for a user",
				type: "SUB_COMMAND",
				options: [
					{
						name: "user",
						description: "The user to time-out",
						type: "USER",
						required: true
					},
					{
						name: "reason",
						description: "The reason to time-out the user (shows up in the audit log)",
						type: "STRING",
						required: false
					}
				]
			}
		]
	}),
	guildOnly: true,
	userPerms: ["MODERATE_MEMBERS"],
	execute(interaction, args) {
		const targetMember = interaction.options.getMember("user");
		const targetMemberTag = targetMember.user.tag;
		if (targetMember.moderatable === false) {
			if (targetMember === interaction.guild.me) return interaction.reply("I can't time-out myself!");
			const embed = new MessageEmbed()
				.setTitle(`I can't time-out ${targetMemberTag}`)
				// eslint-disable-next-line max-len
				.setDescription(`Either I don't have the required permissions or that user is above me in the role hierarchy. Please ensure I have the Moderate Members permission and my highest role is above **${targetMemberTag}**'s highest role.`)
				.setColor(EMBED_COLOUR);
			return interaction.reply({ embeds: [embed] });
		}

		const reason = interaction.options.getString("reason") || "*No reason provided*";
		const embed = new MessageEmbed().setColor(EMBED_COLOUR);
		let time;
		if (args.subcommand === "set") {
			time = interaction.options.getInteger("time") * 60 * 1000;
			const expiresIn = Math.floor((Date.now() + time) / 1000);

			embed
				.setTitle(`Successfully timed out ${targetMemberTag} for ${interaction.options.getInteger("time")} minutes`)
				.setDescription(`**Reason:** ${reason}\nThe timeout expires in ${Formatters.time(expiresIn, "R")}.`)
				.setFooter("Use `/timeout remove` to remove the timeout")
				.setTimestamp();
		} else if (args.subcommand === "remove") {
			if (!targetMember.communicationDisabledUntilTimestamp) return interaction.reply(`**${targetMemberTag}** is not currently timed-out.`);

			time = null;
			embed
				.setTitle(`Successfully removed the time-out for ${targetMemberTag}`)
				.setDescription(`**Reason:** ${reason}`)
				.setFooter("Use `/timeout set` to time-out the user again")
				.setTimestamp();
		}
		targetMember.timeout(time, `${interaction.user.tag} used /timeout [reason: ${reason}]`).then(_ => {
			interaction.reply({ embeds: [embed] });
		}).catch(_ => {
			createErrorEmbed(null, `I couldn't time-out **${targetMemberTag}**. Please ensure I have the required permissions and try again.`);
		});
	}
};
