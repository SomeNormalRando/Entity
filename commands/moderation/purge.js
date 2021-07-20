module.exports = {
	name: 'purge',
	aliases: ['delete', 'clean', 'massdelete', 'bulkdelete'],
	description: 'Used to mass delete messages (note: messages older than 2 weeks cannot be deleted)',
	usage: '<number>',
	permissions: 'MANAGE_MESSAGES',
	args: true,
	cooldown: 10,
	guildOnly: true,
	execute(message, args) {
		message.channel.bulkDelete(parseInt(args[0], 10) + 1, true)
			.then(amount => message.channel.send(`Deleted ${amount.size} messages.`)
				.then(msg => msg.delete())
			)
			.catch(error => {console.error(error); message.channel.send(`Error deleting messages.`)})
	},
};