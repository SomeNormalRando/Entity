"use strict";
const Discord = require("discord.js");
const { config: { EMBED_COLOUR }, Util: { createErrorEmbed, fetchResource } } = require("../../index.js");

const url = "https://aws.random.cat/meow";
const start = ["Meow", "Meeow", "Meoow", "Meeoow", "Meoww"];
const end = ["!", "...", "...!"];
const errReply = { embeds: [createErrorEmbed("while fetching your cat")], ephemeral: true };
module.exports = {
	data: {
		name: "cat",
		description: "Get some cute cat pictures"
	},
	async execute(interaction) {
		await interaction.deferReply();

		fetchResource(url).then(({ file: image }) => {
			const embed = new Discord.MessageEmbed()
				.setTitle(start.random() + end.random())
				.setColor(EMBED_COLOUR)
				.setImage(image)
				.setTimestamp()
				.setFooter("Powered by random.cat");

			interaction.editReply({ embeds: [embed] });
		}).catch(_ => interaction.editReply(errReply));
	},
};
