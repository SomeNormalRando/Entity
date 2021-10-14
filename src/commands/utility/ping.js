"use strict";
const { Util: { SlashCommand } } = require("../../index");
module.exports = {
	data: new SlashCommand({
		name: "ping",
		description: "Used to test if the bot is online",
	}),
	cooldown: 5,
	async execute(interaction) {
		const initialReply = await interaction.reply({ content: "Pong! Bot is online.", fetchReply: true });

		const latency = `Latency is **${initialReply.createdTimestamp - interaction.createdTimestamp} milliseconds**.`;
		const apiLatency = `API latency is **${Math.round(interaction.client.ws.ping)} milliseconds**.`;

		await interaction.editReply(`${initialReply.content}\n${latency}\n${apiLatency}`);
	}
};
