const Discord = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
	name: 'cat',
	description: 'Get some cute cat pictures',
	async execute(interaction) {
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
			const catEmbed = new Discord.interactionEmbed()
				.setColor('#2F3136')
				.setImage(file);
			interaction.reply({ embeds: [catEmbed] });
		} else {
			interaction.reply({ content: 'An error occured while fetching your cat.', ephmeral: true });
		}
	},
};