"use strict";
const { fetchAnimal } = require("./animal");
module.exports = {
	data: {
		name: "cat",
		description: "Get some cute cat pictures"
	},
	cooldown: 5,
	async execute(interaction) {
		await interaction.deferReply();

		fetchAnimal("cat", interaction);
	},
};
