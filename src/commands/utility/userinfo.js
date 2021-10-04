"use strict";
module.exports = {
	data: {
		name: "userinfo",
		description: "Gives info for a user.",
		options: [{
			name: "user",
			type: "USER",
			description: "The user to show info about",
			required: false,
		}]
	},
	cooldown: "5",
	guildOnly: [true],
	execute(interaction, args) {
		const embed = this.userInfo(args.user || interaction.member);
		interaction.reply({ embeds: [embed] });
	},
	userInfo(guildMember) {
		const Discord = require("discord.js");
		const user = guildMember.user;

		// Permissions
		const permissions = [];
		if (guildMember.permissions.has("ADMINISTRATOR")) {
			permissions[0] = "Administrator (all permissions)";
		} else {
			for (const permission of guildMember.permissions.toArray().sort()) {
				permissions.push(permission.toTitleCase(/VAD/i, /TTS/i));
			}
		}

		// Roles
		const roleIds = Discord.Util.discordSort(guildMember.roles.cache).filter(e => e.id !== guildMember.guild.id);
		const roles = roleIds.map(role => role.toString());

		// Construct embed
		const embed = new Discord.MessageEmbed()
			.setColor(guildMember.displayHexColor)
			.setTitle(user.tag)
			.setDescription(guildMember.toString())
			.setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
			.addFields(
				{ name: "Registered", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>` },
				{ name: "Joined", value: `<t:${Math.floor(guildMember.joinedTimestamp / 1000)}:R>` },
				{ name: "Display Colour (Hex)", value: guildMember.displayHexColor.toUpperCase(), inline: true },
				{ name: `Roles (${roles.length})`, value: roles.reverse().join(" ") },
				{ name: "Permissions", value: permissions.join(", ") },
			)
			.setTimestamp()
			.setFooter(`User ID: ${user.id}`);

		// Ackowledgements (extra variable info to add)
		const acknowledgements = [];

		if (require("../../index").env.OWNERS.includes(user.id)) acknowledgements.push(`Developer of ${guildMember.client.user.username}`);
		if (guildMember.guild.ownerId === user.id) {
			acknowledgements.push("Server Owner");
		}
		if (guildMember.permissions.has("ADMINISTRATOR")) {
			acknowledgements.push("Server Administrator");
		}
		if (guildMember.premiumSince) {
			acknowledgements.push(`Boosting server since ${Discord.Formatters.time(Math.round(guildMember.premiumSinceTimestamp / 1000), "R")}`);
		}

		if (acknowledgements.length) embed.addField("Acknowledgements", acknowledgements.join(", "));

		return embed;
	}
};
