//const quoteObj = require('../../assets/data.json').quotes;
const fetch = require('node-fetch');
module.exports = {
	name: 'inspire',
	aliases: ['inspiringquote'],
	description: 'Read some inspiring quotes!',
 	usage: '',
	args: false,
  	cooldown: 5,
	guildOnly: false,
	botPermissions: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
	async execute(message, args) {
		//let quoteArray = Object.keys(quoteObj);
		//let randomQuoteAuthor = quoteArray[Math.floor(Math.random( ) * quoteArray.length)];
		//let randomQuote = quoteObj[randomQuoteAuthor];
		let result = await fetch('https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?')
	    	.then(response => response.text())
    	let quote = JSON.parse(result.substring(0, result.length - 1).substring(2))
    	message.channel.send(`**${quote.quoteText}**\n- ${quote.quoteAuthor}`)
        //message.channel.send(`**"${randomQuote}"** \n - ${randomQuoteAuthor}`);66564597481480192
	},
};