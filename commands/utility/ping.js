module.exports = {
	name: 'ping',
	aliases: ['latency'],
	description: 'Used to test if the bot is online.',
	usage: '',
	args: false,
	cooldown: 3,
	guildOnly: false,
	execute(message, args) {
		message.channel.send(`Bot is online.`) 
			.then(msg => msg.edit(msg.content += `\nLatency is **${msg.createdTimestamp - message.createdTimestamp} milliseconds**.`));
	},
};