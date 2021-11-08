"use strict";
const { MessageEmbed } = require("discord.js");
const { config: { EMBED_COLOUR } } = require("../../index");
module.exports = {
	data: {
		name: "choose",
		description: "Choose between options of your choice",
		options: [
			{
				name: "option1",
				type: "STRING",
				description: "Option number 1",
				required: true,
			},
			{
				name: "option2",
				type: "STRING",
				description: "Option number 2",
				required: true,
			},
			{
				name: "option3",
				type: "STRING",
				description: "Option number 3",
				required: false,
			},
			{
				name: "option4",
				type: "STRING",
				description: "Option number 4",
				required: false,
			},
			{
				name: "option5",
				type: "STRING",
				description: "Option number 5",
				required: false,
			},
			{
				name: "option6",
				type: "STRING",
				description: "Option number 6",
				required: false,
			},
			{
				name: "option7",
				type: "STRING",
				description: "Option number 7",
				required: false,
			},
			{
				name: "option8",
				type: "STRING",
				description: "Option number 8",
				required: false,
			},
			{
				name: "option9",
				type: "STRING",
				description: "Option number 9",
				required: false,
			},
			{
				name: "option10",
				type: "STRING",
				description: "Option number 10",
				required: false,
			},
		]
	},
	async execute(interaction, args) {
		// Filter null and undefined elements
		const choices = Object.values(args).filter(e => e != null);
		const embed = new MessageEmbed()
			.setTitle(`I choose __${choices.random()}__`)
			.setColor(EMBED_COLOUR)
			.setFooter(`Choosing from ${choices.join(", ")}`);
		await interaction.reply({ embeds: [embed] });
	},
};
