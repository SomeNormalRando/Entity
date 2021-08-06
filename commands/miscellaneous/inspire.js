const fetch = require('node-fetch');
module.exports = {
	name: 'inspire',
	aliases: ['inspiringquote'],
	description: 'Read some inspiring quotes!',
 	usage: '',
	args: false,
  	cooldown: 0,
	guildOnly: false,
	botPermissions: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
	async execute(message, args) {
		let quote = await fetch('https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json')
	    	.then(response => response.json())


		if (!quote) return message.reply('An error occured when fetching your inspiring quote.')
    	message.reply(`**${quote.quoteText}**\n- ${quote.quoteAuthor}`)
	},
};