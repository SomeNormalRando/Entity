"use strict";
const Discord = require("discord.js");
const { Util: { SlashCommand }, Constants: { EMBED_COLOUR } } = require("../../index");
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
		const { user } = args.user ? args.user : interaction.member;
		const embed = this.avatar(user);

		interaction.reply({ embeds: [embed] });
	},
	/**
	 * Creates an embed with the avatar of a user
	 * @param {Discord.User} user The user to show the avatar
	 * @returns {Discord.MessageEmbed} The embed
	 */
	avatar(user) {
		return new Discord.MessageEmbed()
			.setColor(EMBED_COLOUR)
			.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ format: "png", dynamic: true }) })
			.setTitle("Avatar")
			.setImage(`${user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })}`);
	}
};
