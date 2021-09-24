const Discord = require("discord.js");
module.exports = {
	data: {
		name: "serverinfo",
		description: "Gives info for the current server."
	},
	guildOnly: true,
	async execute(interaction) {
		// Define variables
		const guild = interaction.guild;
		const owner = await guild.fetchOwner().then(result => result);

		// Guild features
		const guildFeatures = [];
		for (const feature of guild.features) {
			guildFeatures.push(feature.toTitleCase());
		}

		// Contruct embed
		const embed = new Discord.MessageEmbed()
			.setColor("#2F3136")
			.setTitle(guild.name)
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.addFields(
				{ name: "Server", value: `
				Owner: ${owner} (${owner.user.tag})
				Created: ${Discord.Formatters.time(Math.round(guild.createdTimestamp / 1000), "R")}
				Members: ${guild.memberCount}
				` },
				{ name: "Channels", value: `
					Text Channels: ${guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size}
					Voice Channels:  ${guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size}
				`, inline: true },
				{ name: "Moderation", value: `
				Verification Level: ${guild.verificationLevel.toTitleCase()}
				Explicit Content Filter: ${guild.explicitContentFilter.toTitleCase()}
				` },
				{ name: "Roles", value: Array.from(guild.roles.cache).length.toString(), inline: true },
			)
			.setFooter(`Server ID: ${guild.id}`, guild.iconURL({ dynamic: true }))
			.setTimestamp();

		// Variable values
		if (guild.emojis) {
			embed.addField("Emojis", guild.emojis.cache.map(e => e.toString()).length.toString(), true);
		}
		if (guildFeatures.length) {
			embed.addField("Features", guildFeatures.join(", "));
		}
		if (guild.premiumSubscriptionCount) {
			embed.addField("Boosts", `Level ${guild.premiumTier.substr(5) || "0"} (${guild.premiumSubscriptionCount} boost(s))`, true);
		}

		// Send embed
		await interaction.reply({ embeds: [embed] });
	},
};