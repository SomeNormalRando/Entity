module.exports = {
	name: 'wikipedia',
	aliases: ['wikipediasearch'],
	description: 'Search Wikipedia for stuff!',
	usage: '<query>',
	args: true,
	cooldown: 5,
	guildOnly: false,
	execute(message, args) {
		let searchQuery = args.join('%20');
		message.reply(`**Wikipedia search results for ${args.join(' ')}:** \nhttps://en.wikipedia.org?search=${searchQuery}`);
	},
};