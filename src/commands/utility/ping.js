"use strict";
module.exports = {
	data: {
		name: "ping",
		description: "Used to test if the bot is online",
	},
	async execute(interaction) {
		await interaction.reply("Pong! Bot is online.");
		let replyMsg;
		await interaction.fetchReply()
			// eslint-disable-next-line no-return-assign
			.then(reply => replyMsg = reply);

		const latency = `Latency is **${replyMsg.createdTimestamp - interaction.createdTimestamp} milliseconds**.`;
		const apiLatency = `API latency is **${Math.round(interaction.client.ws.ping)} milliseconds**.`;

		await interaction.editReply(`${replyMsg.content}\n${latency}\n${apiLatency}`);
	}
};
