const Discord = require('discord.js');
module.exports = {
	name: 'poll',
	aliases: ['yesno'],
	description: 'Makes a yes/no poll.',
	usage: '<poll title>',
	args: true,
	cooldown: 5,
	guildOnly: false,
	botPermissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
	async execute(message, args) {
		if (message.channel.type === 'dm') {
			await message.channel.send('dude why would you even want to make a a poll in a dm');
			await message.channel.send('anyway');
		}
		const pollEmbed = new Discord.MessageEmbed()
			.setColor('#2F3136')
			.setTitle(`${args.join(' ')}`)
			.setTimestamp()
			.setFooter(`Poll by ${message.author.tag}`);
		await message.channel.send({ embeds: [pollEmbed] })
			.then(msg => {
				msg.react('👍');
				msg.react('👎');
			});

	},
};