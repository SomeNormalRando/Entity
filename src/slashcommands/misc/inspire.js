const fetch = require("node-fetch");
module.exports = {
	data: {
		name: "inspire",
		description: "Get a random inspiring quote",
	},
	async execute(interaction, args) {
		const quote = await fetch("https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json")
			.then(async response => {
				response = await response.text();
				return JSON.parse(response);
			});

		if (!quote) return interaction.reply({ content: "An error occured when fetching your inspiring quote.", ephemeral: true });

		interaction.reply(`**${quote.quoteText}**\n- ${quote.quoteAuthor || "Anonymous"}`);
	},
};