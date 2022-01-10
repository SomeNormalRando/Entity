"use strict";
const { MessageEmbed, Formatters } = require("discord.js");
const {
	Constants: { EMBED_COLOUR, EMBED_LIMITS: { FIELD_VALUE } },
	Util: { SlashCommand, toTitleCase, trimArr, toYesNo, testCol }
} = require("../../index.js");
module.exports = {
	data: new SlashCommand({
		name: "roleinfo",
		description: "Get info on a role",
		options: [
			{
				name: "role",
				type: "ROLE",
				description: "The role to show info for",
				required: true,
			},
			{
				name: "permissions",
				type: "BOOLEAN",
				description: "Whether to show the role's permissions (default true)",
				required: false,
			}
		]
	}),
	cooldown: "5",
	guildOnly: [true],
	execute(interaction, args) {
		const embed = this.roleInfo(args.role, args.permissions ?? true);
		interaction.reply({ embeds: [embed] });
	},
	roleInfo(role, showPermissions = true) {
		// Construct embed
		const embed = new MessageEmbed()
			.setColor(testCol(role.hexColor, EMBED_COLOUR))
			.setTitle(role.name)
			.setDescription(role.toString())
			.addFields(
				{ name: "Created", value: `${Formatters.time(Math.round(role.createdTimestamp / 1000), "R")}`, inline: true },
				{ name: "Display Colour (Hex)", value: testCol(role.hexColor.toUpperCase()), inline: true },
				{ name: "Mentionable", value: toYesNo(role.mentionable), inline: true },
				{ name: "Hoisted", value: toYesNo(role.hoist), inline: true },
				{ name: "Position", value: role.position.toString(), inline: true }
			)
			.setTimestamp()
			.setFooter({ text: `Role ID: ${role.id}` });

		// Permissions
		if (showPermissions === true) {
			const permissions = role.permissions.has("ADMINISTRATOR")
				? ["Administrator (all permissions)"]
				: role.permissions.toArray().sort().map(perm => toTitleCase(perm, /VAD/i, /TTS/i));
			embed.addField("Permissions", trimArr(permissions, FIELD_VALUE, ", ") || "None");
		}

		return embed;
	}
};
