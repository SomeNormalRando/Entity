"use strict";
const { MessageEmbed, Util, Formatters } = require("discord.js");
const {
	Constants: { EMBED_LIMITS: { FIELD_VALUE }, EMBED_COLOUR },
	Util: { SlashCommand, toTitleCase, trimArr, testCol },
	env
} = require("../../index.js");
module.exports = {
	data: new SlashCommand({
		name: "userinfo",
		description: "Get info on a user",
		options: [
			{
				name: "user",
				type: "USER",
				description: "The user to show info for",
				required: false,
			},
			{
				name: "roles",
				type: "BOOLEAN",
				description: "Whether to show the user's roles (default true)",
				required: false,
			},
			{
				name: "permissions",
				type: "BOOLEAN",
				description: "Whether to show the user's permissions (default true)",
				required: false,
			}
		]
	}),
	cooldown: "5",
	guildOnly: [true],
	execute(interaction, args) {
		const embed = this.userInfo(args.user || interaction.member, args.roles ?? true, args.permissions ?? true);
		interaction.reply({ embeds: [embed] });
	},
	userInfo(guildMember, showRoles = true, showPermissions = true) {
		const { user } = guildMember;

		// Construct embed
		const embed = new MessageEmbed()
			.setColor(testCol(guildMember.displayHexColor, EMBED_COLOUR))
			.setTitle(user.tag)
			.setDescription(guildMember.toString())
			.setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
			.addFields(
				{ name: "Registered", value: `${Formatters.time(Math.round(user.createdTimestamp / 1000), "R")}` },
				{ name: "Joined", value: `${Formatters.time(Math.round(guildMember.joinedTimestamp / 1000), "R")}` },
				{ name: "Display Colour (Hex)", value: testCol(guildMember.displayHexColor.toUpperCase()), inline: true },
			)
			.setTimestamp()
			.setFooter({ text: `User ID: ${user.id}` });

		// Roles
		if (showRoles === true) {
			// Sort, remove @everyone and map to mentions
			const roles = Util.discordSort(guildMember.roles.cache)
				.filter(e => e.id !== guildMember.guild.id)
				.map(role => role.toString())
				.reverse();
			embed.addField(`Roles (${roles.length})`, trimArr(roles, FIELD_VALUE, " "));
		}
		// Permissions
		if (showPermissions === true) {
			const permissions = guildMember.permissions.has("ADMINISTRATOR")
				? ["Administrator (all permissions)"]
				: guildMember.permissions.toArray().sort().map(perm => toTitleCase(perm, /VAD/i, /TTS/i));
			embed.addField("Permissions", trimArr(permissions, FIELD_VALUE));
		}

		// Acknowledgements (extra variable info to add)
		const acknowledgements = [];

		if (env.OWNERS.includes(user.id)) acknowledgements.push(`Developer of ${guildMember.client.user.username}`);
		if (guildMember.guild.ownerId === user.id) {
			acknowledgements.push("Server Owner");
		}
		if (guildMember.permissions.has("ADMINISTRATOR")) {
			acknowledgements.push("Server Administrator");
		}
		if (guildMember.premiumSince) {
			acknowledgements.push(`Boosting server since ${Formatters.time(Math.round(guildMember.premiumSinceTimestamp / 1000), "R")}`);
		}

		if (acknowledgements.length) embed.addField("Acknowledgements", acknowledgements.join(", "));

		return embed;
	}
};
