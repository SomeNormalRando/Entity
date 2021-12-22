"use strict";
const { fetchAnimal } = require("./animal");
module.exports = {
	data: {
		name: "dog",
		description: "Get some random dog pictures",
	},
	cooldown: 5,
	async execute(interaction) {
		await interaction.deferReply();

		fetchAnimal("dog", interaction);
	},
};
