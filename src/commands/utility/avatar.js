"use strict";
const { Util: { SlashCommand } } = require("../../index");
module.exports = {
	data: new SlashCommand({
		name: "avatar",
		description: "Get a user's avatar",
		options: [{
			name: "user",
			type: "USER",
			description: "User to get the avatar",
			required: false,
		}],
	}),
	cooldown: 3,
	execute(interaction, args) {
		let user;
		if (!args.user) user = interaction.member.user;
		else user = args.user.user;
		const embed = this.avatar(user);

		interaction.reply({ embeds: [embed] });
	},
	/**
	 * Creates an embed with the avatar of a user
	 * @param {Discord.User} user The user to show the avatar
	 * @returns {Discord.MessageEmbed} The embed
	 */
	avatar(user) {
		const Discord = require("discord.js");
		return new Discord.MessageEmbed()
			.setColor("#2F3136")
			.setAuthor(user.tag, user.displayAvatarURL({ format: "png", dynamic: true }))
			.setTitle("Avatar")
			.setImage(`${user.displayAvatarURL({ format: "png", dynamic: true })}?size=1024`);
	}
};
