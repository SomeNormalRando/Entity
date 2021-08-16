module.exports = {
	name: 'setslowmode',
	aliases: ['slowmode'],
	description: 'Used to set slowmode for a channel',
	usage: '<set|=|add|+|remove> <seconds>',
	args: true,
	cooldown: 10,
	guildOnly: true,
	userPermissions: ['MANAGE_CHANNELS'],
	botPermissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_CHANNELS'],
	execute(message, args) {
		let duration = parseInt(args[1], 10)
		if (args[0] == 'remove' || args < 1) {
			message.channel.setRateLimitPerUser(duration, `Command setslowmode was used by ${message.author.tag}`);
			message.channel.send(`Disabled slowmode for ${message.channel}.`)
		} else if (args[0] == 'add' || args[0] == '+') {
			message.channel.setRateLimitPerUser(duration + message.channel.rateLimitPerUser, `Command setslowmode was used by ${message.author.tag}`);
			message.channel.send(`Set slowmode for ${message.channel} to ${duration + message.channel.rateLimitPerUser} second(s).`)
		} else if (args[0] == 'set' || args[0] == '=') {
			message.channel.setRateLimitPerUser(duration, `Command setslowmode was used by ${message.author.tag}`);
			message.channel.send(`Set slowmode for ${message.channel} to ${duration} second(s).`)
		};
	},
};