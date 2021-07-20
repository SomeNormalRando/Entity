const quoteObj = require('../../assets/data.json').quotes;
module.exports = {
	name: 'inspire',
	aliases: ['inspiringquote'],
	description: 'Read some inspiring quotes!',
 	usage: '',
	args: false,
  	cooldown: 5,
	guildOnly: false,
	execute(message, args) {
		let quoteArray = Object.keys(quoteObj);
		let randomQuoteAuthor = quoteArray[Math.floor(Math.random( ) * quoteArray.length)];
		let randomQuote = quoteObj[randomQuoteAuthor];
        message.channel.send(`**"${randomQuote}"** \n - ${randomQuoteAuthor}`);
	},
};