"use strict";
const Discord = require("discord.js");
const { Util: { SlashCommand } } = require("../../index");
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
			interaction.editReply({ content: "An error occured while executing this command", ephemeral: true });
		});
	},
	async guildInfo(guild) {
		const owner = await guild.fetchOwner();
		const channels = await guild.channels.fetch();
		const roles = await guild.roles.fetch();

		const text = {
			server: [
				`**Owner:** ${owner} (${owner.user.tag})`,
				`**Created:** ${Discord.Formatters.time(Math.round(guild.createdTimestamp / 1000), "R")}`,
				`**Members:** ${guild.memberCount}`
			],
			channels: [
				`**Categories:** ${channels.filter(c => c.type === "GUILD_CATEGORY").size}`,
				`**Text:** ${channels.filter(c => c.type === "GUILD_TEXT").size}`,
				`**Voice:** ${channels.filter(c => c.type === "GUILD_VOICE").size}`
			],
			moderation: [
				`**Verification Level:** ${guild.verificationLevel.toTitleCase()}`,
				`**Explicit Content Filter:** ${guild.explicitContentFilter.toTitleCase()}`
			]
		};

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
				{ name: "__Server__", value: text.server.join("\n") },
				{ name: "__Channels__", value: text.channels.join("\n"), inline: true },
				{ name: "__Moderation__", value: text.moderation.join("\n") },
				{ name: "__Roles__", value: `${roles.size} (${roles.filter(r => r.hoist).size} hoisted)`, inline: true },
			)
			.setFooter(`ID: ${guild.id}`, guild.iconURL({ dynamic: true }))
			.setTimestamp();

		// Variable values
		if (guild.emojis) {
			embed.addField("Emojis", guild.emojis.cache.map(e => e.toString()).length.toString(), true);
		}
		if (guildFeatures.length) {
			embed.addField("Features", guildFeatures.join(", "));
		}
		if (guild.premiumSubscriptionCount !== 0) {
			embed.addField("Boosts", `Level ${guild.premiumTier.substr(5) || "0"} (${guild.premiumSubscriptionCount} boost(s))`, true);
		}
		return embed;
	}
};
