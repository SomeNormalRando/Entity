const fetch = require('node-fetch');
module.exports = {
	name: 'joke',
	aliases: ['jokes', 'tellmeajoke'],
	description: 'Gives you a random Chuck Norris joke from https://api.chucknorris.io/',
	usage: '',
	args: false,
	cooldown: 5,
	guildOnly: false,
	async execute(message, args) {
		const { value } = await fetch('https://api.chucknorris.io/jokes/random')
			.then(response => response.json())
        message.reply(value);
	},
};