module.exports = {
	name: 'ping',
	aliases: [],
	description: 'Used to test if the bot is online.',
	usage: '',
	args: false,
	cooldown: 3,
	guildOnly: false,
	botPermissions: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
	execute(message, args) {
		message.reply(`Pong! Bot is online.`)
			.then(msg => msg.edit(msg.content += `\nLatency is **${msg.createdTimestamp - message.createdTimestamp} milliseconds**.\nAPI latency is **${Math.round(message.client.ws.ping)} milliseconds**.`));
	},
};