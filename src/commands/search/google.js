module.exports = {
	name: 'google',
	aliases: ['googlesearch', 'search'],
	description: 'Search Google for stuff!',
	usage: '<query>',
	args: true,
	cooldown: 5,
	guildOnly: false,
	execute(message, args) {
		const searchQuery = args.join('%20');
		message.reply(`**Google search results for ${args.join(' ')}**: \nhttps://google.com/search?q=${searchQuery}`);
	},
};