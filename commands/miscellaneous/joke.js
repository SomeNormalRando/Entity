module.exports = {
	name: 'joke',
	aliases: ['jokes', 'tellmeajoke'],
	description: 'Jokes',
	usage: '',
	args: false,
	cooldown: 5,
	guildOnly: false,
	execute(message, args) {
		const jokes = [
          'What’s the best thing about Switzerland? \nI don’t know, but the flag is a big plus.',
          'Why do we tell actors to “break a leg?” \nBecause every play has a cast.',
          'I invented a new word: \nPlagiarism!',
          'Did you hear about the mathematician who’s afraid of negative numbers? \nHe’ll stop at nothing to avoid them.',
          'Yesterday I saw a guy spill all his Scrabble letters on the road. \nI asked him, “What’s the word on the street?”',
        ];
        message.channel.send(jokes[Math.floor(Math.random() * jokes.length)]);
	},
};