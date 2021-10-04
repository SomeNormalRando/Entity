"use strict";
const Discord = require("discord.js");
const { Util: { SlashCommand }, config: { inviteLink } } = require("../../index");
const adminInvite = inviteLink.replace(/permissions=\d+?/, "permissions=8");
module.exports = {
	data: new SlashCommand({
		name: "invite",
		description: "Gives you my invite link",
	}),
	cooldown: 3,
	execute(interaction) {
		const embed = new Discord.MessageEmbed()
			.setTitle("Bot invite link:")
			.setColor("#003fff")
			.setDescription(`[Invite link (normal)](${inviteLink})\n[Invite link (admin)](${adminInvite})`)
			.setTimestamp()
			.setFooter(interaction.client.user.tag, interaction.client.user.displayAvatarURL({ format: "png", dynamic: true }));
		interaction.reply({ embeds: [embed] });
	}
};
