const Discord = require('discord.js');
const { inviteLink } = require('../../config.json');
module.exports = {
	name: 'invitelink',
	aliases: ['invite'],
	description: 'Invite me to your server!',
	usage: '',
	args: false,
	cooldown: 5,
	guildOnly: false,
	botPermissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
	execute(message, args) {
		const embed = new Discord.MessageEmbed()
			.setTitle('Invite links:')
			.setColor('#003fff')
			.setDescription(`[Bot invite link](${inviteLink})`)
			.setTimestamp()
			.setFooter(message.client.user.tag, message.client.user.displayAvatarURL({ format: "png", dynamic: true }));
		message.channel.send({ embeds: [embed] });
	},
};