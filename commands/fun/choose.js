module.exports = {
  	name: 'choose',
	aliases: ['imtoolazysohelpmechoose'],
	description: 'Chooses between two or more options.',
	usage: '<option1> <option2>',
	args: true,
	cooldown: 5,
	guildOnly: false,
	botPermissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
	async execute(message, args) {
		if (args.length < 2) {
			return message.reply('Please supply at least two arguments.')
		}
		const result = args[Math.floor(Math.random() * args.length)];
		await message.channel.send(`<a:thonking:839730586112360469>`)
			.then(msg => setTimeout(() => msg.edit(`I choose **${result}**.`), 1250))
	},
};