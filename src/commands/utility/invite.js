"use strict";
const Discord = require("discord.js");
const { config } = require("../../index.js");
const { Util: { SlashCommand } } = require("../../index");
module.exports = {
	data: new SlashCommand({
		name: "invite",
		description: "Gives you my invite link",
	}),
	execute(interaction) {
		const embed = new Discord.MessageEmbed()
			.setTitle("Bot invite link:")
			.setColor("#003fff")
			.setDescription(config.inviteLink)
			.setTimestamp()
			.setFooter(interaction.client.user.tag, interaction.client.user.displayAvatarURL({ format: "png", dynamic: true }));
		interaction.reply({ embeds: [embed] });
	}
};
