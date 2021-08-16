const Discord = require('discord.js');
const { Util } = require('../../index.js');
module.exports = {
	data: {
		name: 'serverinfo',
		description: 'Gives info for the current server.'
	},
	guildOnly: true,
	async execute(interaction) {
		const guild = interaction.guild;
		const owner = await guild.fetchOwner().then(result => result);
		const guildFeatures = guild.features;
		guildFeatures.forEach((element, index) => {
			guildFeatures[index] = Util.normalizeStr(element);
		});
		let afkTimeout = '';
		if (guild.afkChannel) {
			afkTimeout = `AFK Channel Timeout: ${guild.afkTimeout}`;
		}
		const embed = new Discord.MessageEmbed()
			.setColor('#2F3136')
			.setTitle(guild.name)
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.addFields(
				{ name: 'Server', value: `
				Owner: ${owner} (${owner.user.tag})
				Created: <t:${Math.floor(guild.createdTimestamp / 1000)}:R>
				Members: ${guild.memberCount}
				` },
				{ name: 'Channels', value: `
					**Text Channels:** ${guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size}
					**Voice Channels:**  ${guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size}
					AFK Voice Channel: ${guild.afkChannel?.name || 'None'}\n${afkTimeout}
				`, inline: true },
				{ name: 'Moderation', value: `Verification Level: ${Util.normalizeStr(guild.verificationLevel)}\nExplicit Content Filter: ${Util.normalizeStr(guild.explicitContentFilter)}` },
				{ name: 'Roles', value: Array.from(guild.roles.cache).length.toString(), inline: true },
			)
			.setFooter(`Server ID: ${guild.id}`, guild.iconURL({ dynamic: true }))
			.setTimestamp();
		if (guild.emojis) {
			embed.addField('Emojis', guild.emojis.cache.map(e => e.toString()).length.toString(), true);
		}
		if (guildFeatures) {
			embed.addField('Features', guildFeatures.join(", "));
		}
		if (guild.premiumSubscriptionCount) {
			embed.addField('Boosts', `Level ${guild.premiumTier.substr(5)} (${guild.premiumSubscriptionCount} boosts)`, true);
		}

		await interaction.reply({ embeds: [embed] });
	},
};