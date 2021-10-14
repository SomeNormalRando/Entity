"use strict";
const Discord = require("discord.js");
const Canvas = require("canvas");
module.exports = {
	data: {
		name: "brain",
		description: "Generates an expanding brain meme",
		options: [
			{
				name: "panel1",
				description: "Text for panel 1 of the meme",
				type: "STRING",
				required: true,
			},
			{
				name: "panel2",
				description: "Text for panel 2 of the meme",
				type: "STRING",
				required: true,
			},
			{
				name: "panel3",
				description: "Text for panel 3 of the meme",
				type: "STRING",
				required: true,
			},
			{
				name: "panel4",
				description: "Text for panel 4 of the meme",
				type: "STRING",
				required: true,
			}
		]
	},
	cooldown: 5,
	async execute(interaction, args) {
		await interaction.deferReply();

		const canvas = Canvas.createCanvas(425, 601);
		const context = canvas.getContext("2d");
		const template = await Canvas.loadImage("./assets/expanding_brain.png");
		context.textAlign = "center";

		context.drawImage(template, 0, 0, canvas.width, canvas.height);
		context.font = applyText(canvas, args.panel1);
		context.fillStyle = "#000000";
		context.fillText(args.panel1, canvas.width / 2, canvas.height / 1.5);

		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "brain.png");
		await interaction.editReply({ files: [attachment] });

	},
};
function applyText(canvas, text) {
	const context = canvas.getContext("2d");
	let fontSize = 70;
	do {
		context.font = `${fontSize -= 10}px sans-serif`;
	} while (context.measureText(text).width > canvas.width - 400);

	return context.font;
}
