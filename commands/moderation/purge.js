module.exports = {
	name: 'purge',
	aliases: ['delete', 'clean', 'massdelete', 'bulkdelete'],
	description: 'Used to mass delete messages (note: messages older than 2 weeks cannot be deleted)',
	usage: '<number>',
	args: true,
	cooldown: 10,
	guildOnly: true,
	userPermissions: ['MANAGE_MESSAGES'],
	botPermissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
	execute(message, args) {
		message.channel.bulkDelete(parseInt(args[0], 10) + 1, true)
			.then(amount => message.channel.send(`Deleted ${amount.size} messages.`)
				.then(msg => msg.delete())
			)
			.catch(error => {console.error(error); message.channel.send(`Error deleting messages.`)})
	},
};