module.exports = {
	name: 'say',
	aliases: [],
	description: 'Makes the bot say something of your choice.',
	usage: '<text>',
	args: true,
	cooldown: 3,
	guildOnly: true,
	execute(message, args) {
		let content = args.join(" ");
		message.channel.send(`${content} \n*- ${message.author}*`);
	},
};