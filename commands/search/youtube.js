module.exports = {
	name: 'youtube',
	aliases: ['yt', 'youtubesearch', 'ytsearch'],
	description: 'Search YouTube for stuff!',
	usage: '<query>',
	args: true,
	cooldown: 5,
	guildOnly: false,
	execute(message, args) {
		let searchQuery = args.join('%20');
		message.channel.send(`**Youtube** search results for ${args.join(' ')}: \nhttps://youtube.com/results?search_query=${searchQuery}`);
	},
};