"use strict";
const Discord = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
	data: {
		name: "inspire",
		description: "Get a random inspiring quote",
	},
	async execute(interaction) {
		const quote = await fetch("https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json")
			.then(async response => {
				const result = await response.text();
				return JSON.parse(result);
			});

		if (!quote) return interaction.reply({ content: "An error occured when fetching your inspiring quote.", ephemeral: true });
		const embed = new Discord.MessageEmbed()
			.setTitle(quote.quoteText)
			.setDescription(`**- ${quote.quoteAuthor || "Anonymous"}**`)
			.setTimestamp();

		interaction.reply({ embeds: [embed] });
	},
};
