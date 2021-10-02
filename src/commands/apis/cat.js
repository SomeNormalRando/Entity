"use strict";
const Discord = require("discord.js");
const fetch = require("node-fetch");

const { config } = require("../../index.js");
const url = "https://aws.random.cat/meow";
module.exports = {
	data: {
		name: "cat",
		description: "Get some cute cat pictures"
	},
	async execute(interaction) {
		const { file } = await fetch(url)
			.then(response => response.json().catch(err => console.error(err)))
			.catch(err => {
				console.error(err);
			});

		if (file) {
			const catEmbed = new Discord.MessageEmbed()
				.setTitle("Your random cat")
				.setColor(config.embedColour)
				.setImage(file)
				.setTimestamp()
				.setFooter(`Powered by ${url}`);
			interaction.reply({ embeds: [catEmbed] });
		} else {
			interaction.reply({ content: "An error occured while fetching your cat.", ephemeral: true });
		}
	},
};
