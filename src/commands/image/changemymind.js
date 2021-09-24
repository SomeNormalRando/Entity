"use strict";
const Discord = require("discord.js");
const Canvas = require("canvas");
module.exports = {
	data: {
		name: "changemymind",
		description: "Generates a change my mind meme",
		options: [{
			name: "text",
			description: "The text for the meme text",
			type: "STRING",
			required: true,
		}]
	},
	async execute(interaction, args) {
		await interaction.deferReply();

		const applyText = (canvas, text) => {
			const context = canvas.getContext("2d");
			let fontSize = 70;
			do {
				context.font = `${fontSize -= 10}px sans-serif`;
			} while (context.measureText(text).width > canvas.width - 400);

			return context.font;
		};

		const canvas = Canvas.createCanvas(1182, 1182);
		const context = canvas.getContext("2d");
		const template = await Canvas.loadImage("./assets/changemymind.png");
		context.textAlign = "center";

		context.drawImage(template, 0, 0, canvas.width, canvas.height);
		context.font = applyText(canvas, args.text);
		context.fillStyle = "#000000";
		context.fillText(args.text, canvas.width / 2, canvas.height / 1.5);

		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "changemymind.png");
		await interaction.editReply({ files: [attachment] });

	},
};
