const Discord = require('discord.js');
module.exports = {
	name: 'invitelink',
	aliases: ['invite'],
	description: 'Invite me to your server!',
	usage: '',
	args: false,
	cooldown: 5,
	guildOnly: false,
	execute(message, args) {
		const embed = new Discord.MessageEmbed()
			.setTitle('Invite links:')
			.setColor('#003fff')
			.setDescription('[Bot invite link](https://discord.com/oauth2/authorize?client_id=812960290718482483&scope=bot&permissions=808971384)\n[Owner\'s server](https://discord.gg/WDuHdwwef5) (Not a support server)')
			.setTimestamp()
			.setFooter(message.client.user.tag, message.client.user.displayAvatarURL({format: "png", dynamic: true}))
		message.channel.send(embed);
	},
};