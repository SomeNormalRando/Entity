module.exports = {
	name: 'ping',
	description: 'Used to test if the bot is online',
	async execute(interaction) {
		await interaction.reply(`Pong! Bot is online.`);
		let replyMsg;
		await interaction.fetchReply()
			.then(reply => replyMsg = reply);
			
		await interaction.editReply(
			replyMsg.content += `\nLatency is **${replyMsg.createdTimestamp - interaction.createdTimestamp} milliseconds**.\nAPI latency is **${Math.round(interaction.client.ws.ping)} milliseconds**.`
		)
	}
}