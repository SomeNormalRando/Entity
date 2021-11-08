"use strict";
const { Formatters, MessageEmbed, Util: { discordSort }, DiscordAPIError } = require("discord.js");
const {
	Util: { SlashCommand, toTitleCase, trimArr },
	config: { EMBED_COLOUR, EMBED_LIMITS: { FIELD_VALUE } }
} = require("../../index");
module.exports = {
	data: new SlashCommand({
		name: "serverinfo",
		description: "Get server info/stats."
	}),
	cooldown: 5,
	guildOnly: [true, "This isn't a server! Use this command in one instead."],
	execute(interaction) {
		interaction.deferReply();
		this.guildInfo(interaction.guild).then(embed => interaction.editReply({ embeds: [embed] })).catch(err => {
			console.error(err);
			interaction.editReply({ content: "An error occurred while executing this command.", ephemeral: true });
		});
	},
	async guildInfo(guild) {
		const owner = await guild.fetchOwner();
		const channels = await guild.channels.fetch().catch(err => {
			if (err instanceof DiscordAPIError) return [];
			console.error(err);
		});
		const roles = await guild.roles.fetch().catch(err => {
			if (err instanceof DiscordAPIError) return [];
			console.error(err);
		});

		const text = {
			server: [
				`**Owner:** ${owner} (${owner.user.tag})`,
				`**Created:** ${Formatters.time(Math.round(guild.createdTimestamp / 1000), "R")}`,
				`**Members:** ${guild.memberCount}`
			],
			channels: [
				`**Categories:** ${channels.filter(ch => ch.type === "GUILD_CATEGORY").size}`,
				`**Text:** ${channels.filter(ch => ch.type === "GUILD_TEXT").size}`,
				`**Voice:** ${channels.filter(ch => ch.type === "GUILD_VOICE").size}`
			],
			moderation: [
				`**Verification Level:** ${toTitleCase(guild.verificationLevel)}`,
				`**Explicit Content Filter:** ${toTitleCase(guild.explicitContentFilter)}`
			]
		};

		// Construct embed
		const embed = new MessageEmbed()
			.setColor(EMBED_COLOUR)
			.setTitle(guild.name)
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.addFields(
				{ name: "__Server__", value: text.server.join("\n") },
				{ name: "__Channels__", value: text.channels.join("\n"), inline: true },
				{ name: "__Moderation__", value: text.moderation.join("\n") },
				{ name: "__Roles__", value: `${roles.size} (${roles.filter(role => role.hoist).size} hoisted)`, inline: true },
			)
			.setFooter(`ID: ${guild.id}`, guild.iconURL({ dynamic: true }))
			.setTimestamp();

		// Variable values
		const emojis = discordSort(guild.emojis.cache).map(e => e.toString());
		embed.addField(`Emojis (${emojis.length})`, trimArr(emojis, FIELD_VALUE, " ") || "None", true);

		if (guild.features.length) {
			const guildFeatures = [...guild.features].map(feat => toTitleCase(feat));
			embed.addField("Features", trimArr(guildFeatures, FIELD_VALUE, ", "));
		}
		if (guild.premiumSubscriptionCount !== 0) {
			const boosts = guild.premiumSubscriptionCount;
			embed.addField(
				"Boosts",
				`Level ${guild.premiumTier.substr(5) || "0"} (${boosts} boost${boosts === 1 ? "" : "s"})`,
				true
			);
		}
		return embed;
	}
};
