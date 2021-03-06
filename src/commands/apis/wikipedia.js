"use strict";
const { Util: { SlashCommand } } = require("../../index.js");
const mediawiki = require("../../assets/mediawiki");

const baseURL = "https://en.wikipedia.org/w/api.php";
const wikipediaLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wikipedia-logo-v2-en.svg/1200px-Wikipedia-logo-v2-en.svg.png";
module.exports = {
	data: new SlashCommand({
		name: "wikipedia",
		description: "Search stuff on Wikipedia!",
		options: [
			{
				name: "query",
				description: "The Wikipedia query",
				type: "STRING",
				required: true
			},
			{
				name: "only_description",
				description: "Whether to only show the description of the page (default false)",
				type: "BOOLEAN",
				required: false,
			}
		]
	}),
	cooldown: 7,
	async execute(interaction, args) {
		await interaction.deferReply();

		const query = encodeURIComponent(args.query);
		const searchLink = `https://en.wikipedia.org?search=${query}`;

		const embed = await mediawiki({
			baseURL,
			query,
			searchLink,
			defaultImage: wikipediaLogo,
			onlyDescription: args.only_description ?? false,
			notFound: {
				title: `No results found for '${query}'`,
				description: `[Try searching for it](${searchLink})`
			}
		});

		await interaction.editReply({ embeds: [embed] });
	}
};
