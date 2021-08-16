const Discord = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
	name: 'cat',
	description: 'Get images of random cats! Images from https://aws.random.cat.',
	aliases: ['cats', 'kitty', 'meow', 'purr'],
	usage: '',
	cooldown: 3,
	async execute(message, args) {
		const { file } = await fetch('https://aws.random.cat/meow') || {}
			.then(response => response.json()
				.catch(err => {
					console.error(err);
				}),
			)
			.catch(err => {
				console.error(err);
			});

		if (file) {
			const catEmbed = new Discord.MessageEmbed()
				.setColor('#2F3136')
				.setImage(file)
				.setFooter(`Requested by ${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
				.setTimestamp();
			message.reply({ embeds: [catEmbed] });
		} else {
			message.reply('An error occured while fetching your cat.');
		}
	},
};