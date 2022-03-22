"use strict";
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const { Util: { createErrorEmbed }, Constants: { EMBED_COLOUR } } = require("../../index");
const errReply = { embeds: [createErrorEmbed("while fetching your quote", "Please try again.")], ephemeral: true };
module.exports = {
	data: {
		name: "inspire",
		description: "Get a random inspiring quote",
	},
	async execute(interaction) {
		await interaction.deferReply();

		fetch("https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json").then(async response => {
			// The response will sometimes have escaped single quotes, so turn the response into text, remove it, and parse it into JSON
			const { quoteText, quoteAuthor, quoteLink } = await response.text().then(text => JSON.parse(text.replace(/\\'/g, "'")));

			const embed = new MessageEmbed()
				.setAuthor({ name: quoteText, url: quoteLink })
				.setColor(EMBED_COLOUR)
				.setDescription(`- ${quoteAuthor || "Anonymous"}`)
				.setTimestamp();

			await interaction.editReply({ embeds: [embed] });
		}).catch(_ => interaction.editReply(errReply));
	},
};
