const Discord = require('discord.js');
module.exports = {
	name: 'serverinfo',
	aliases: ['server'],
	description: 'Gives info about the server',
	usage: '',
	args: false,
	cooldown: 5,
	guildOnly: true,
	botPermissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
	async execute(message) {
		const guild = message.guild;
		const members = await guild.members.fetch();
		const guildFeatures = guild.features;
		for (let i = guildFeatures.length; i--;) {
			guildFeatures[i] = '`' + guildFeatures[i] + '`';
		}
		const embed = new Discord.MessageEmbed()
			.setColor('#2F3136')
			.setTitle(guild.name)
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.addFields(
				{ name: 'Server', value: `Owner: ${guild.owner} (${guild.owner.user.tag})\nCreated: <t:${Math.floor(guild.createdTimestamp / 1000)}:R>\nRegion: ${guild.region.toUpperCase()}` },
				{ name: 'Members', value: `Humans: ${members.filter(member => !member.user.bot).size}\nBots: ${guild.members.cache.filter(member => member.user.bot).size}`, inline:true },
				{ name: 'Channels', value: `Text Channels: ${guild.channels.cache.filter((c) => c.type === "text").size}\nVoice Channels:  ${guild.channels.cache.filter((c) => c.type === "voice").size}`, inline: true },
				{ name: 'Moderation', value: `Verification Level: ${guild.verificationLevel}\nExplicit Content Filter: ${guild.explicitContentFilter}` },
				{ name: 'Roles', value: Array.from(guild.roles.cache).length, inline: true },
			)
			.setFooter(`Server ID: ${guild.id}`, guild.iconURL({ dynamic: true }))
			.setTimestamp();
		if (guild.emojis) {
			embed.addField('Emojis', guild.emojis.cache.map(e => e.toString()).length, true);
		}
		if (guildFeatures) {
			embed.addField('Features', guildFeatures.join(", "));
		}
		if (guild.premiumSubscriptionCount) {
			embed.addField('Boosts', `Level ${guild.premiumTier} (${guild.premiumSubscriptionCount} boosts)`, true);
		}

		message.channel.send({ embeds: [embed] });
	},
};