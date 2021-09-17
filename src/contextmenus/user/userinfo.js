const Discord = require("discord.js");
module.exports = {
	name: "Show user info",
	execute(interaction, guildMember) {
		const user = guildMember.user;

		// Permissions
		const permissions = [];
		for (const permission of guildMember.permissions.toArray().sort()) {
			permissions.push(permission.toTitleCase(/VAD/i, /TTS/i));
		}

		// Roles
		const roleIds = Discord.Util.discordSort(guildMember.roles.cache).filter(e => e.id !== interaction.guild.id);
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
				{ name: "Display Colour(Hex)", value: guildMember.displayHexColor, inline: true },
				{ name: `Roles (${roles.length})`, value: roles.reverse().join(" ") },
				{ name: "Permissions", value: permissions.join(", ") },
			)
			.setTimestamp()
			.setFooter(`User ID: ${user.id}`);

		// Ackowledgements (extra variable info to add)
		const acknowledgements = [];

		if (user.id === "728910425780912199") acknowledgements.push(`Owner of ${interaction.client.user.username}`);
		if (interaction.guild.ownerId === user.id) {
			acknowledgements.push("Server Owner");
		}
		if (guildMember.permissions.has("ADMINISTRATOR")) {
			acknowledgements.push("Server Administrator");
		}
		if (guildMember.premiumSince) {
			acknowledgements.push(`Boosting server since ${Discord.Formatters.time(Math.round(guildMember.premiumSinceTimestamp / 1000), "R")}`);
		}

		if (acknowledgements.length) embed.addField("Acknowledgements", acknowledgements.join(", "));

		interaction.reply({ embeds: [embed] });
	}
};