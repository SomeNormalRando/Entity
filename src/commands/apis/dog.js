"use strict";
const Discord = require("discord.js");
const { config: { EMBED_COLOUR }, Util: { createErrorEmbed, fetchResource } } = require("../../index.js");

const url = "https://random.dog/woof.json";
const start = ["Woof", "Wooof", "Woooof"];
const end = ["!", "...", "...!"];
const errReply = { embeds: [createErrorEmbed("while fetching your cat")], ephemeral: true };
module.exports = {
	data: {
		name: "dog",
		description: "Get some random dog pictures",
	},
	async execute(interaction) {
		await interaction.deferReply();

		fetchResource(url).then(({ url: image }) => {
			const embed = new Discord.MessageEmbed()
				.setTitle(start.random() + end.random())
				.setColor(EMBED_COLOUR)
				.setImage(image)
				.setTimestamp()
				.setFooter("Powered by random.dog");

			interaction.editReply({ embeds: [embed] });
		}).catch(_ => interaction.editReply(errReply));
	},
};
