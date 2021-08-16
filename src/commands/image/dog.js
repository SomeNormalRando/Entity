const Discord = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
	name: 'dog',
	description: 'Get images of random dogs! Images from https://dog.ceo/dog-api/.',
	aliases: ['dogs', 'woof', 'bark', 'puppy'],
	usage: '',
	cooldown: 3,
	async execute(message, args) {
		const image = await fetch('https://dog.ceo/api/breeds/image/random')
			.then(response => response.json())
			.catch(err => {
				console.error(err);
				message.reply('An error occured.');
			});
		const dogEmbed = new Discord.MessageEmbed()
			.setColor('#2F3136')
			.setImage(image.message)
			.setFooter(`Requested by ${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
			.setTimestamp();
		message.reply({ embeds: [dogEmbed] });
	},
};