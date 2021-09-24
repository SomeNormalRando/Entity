"use strict";
const Canvas = require("canvas");
module.exports = {
	data: {
		name: "quote",
		description: "Impersonate someone"
	},
	indev: true,
	async execute(interaction) {
		interaction.reply("this is not ready yet");
		// const canvas = Canvas.createCanvas(1028, 128);
		// const context = canvas.getContext("2d");
	},
};
