"use strict";
const { Util: { SlashCommand } } = require("../../index.js");
const mediawiki = require("../../assets/mediawiki");

const baseURL = "fandom.com/api.php";
const fandomLogo = "https://vignette.wikia.nocookie.net/48c4c991-2051-4ced-81ba-a3a69062cd19/";
module.exports = {
	data: new SlashCommand({
		name: "fandom",
		description: "Search stuff on Fandom!",
		options: [
			{
				name: "wiki",
				description: "The Fandom wiki to search on",
				type: "STRING",
				required: true
			},
			{
				name: "query",
				description: "The Fandom query",
				type: "STRING",
				required: true
			},
			{
				name: "only_description",
				description: "Whether to only show the description of the page (default false)",
				type: "BOOLEAN",
				required: false
			}
		]
	}),
	cooldown: 7,
	async execute(interaction, args) {
		await interaction.deferReply();

		const wiki = encodeURIComponent(args.wiki);
		const query = encodeURIComponent(args.query);
		const searchLink = `https://${wiki}.fandom.com/wiki/Special:Search?query=${query}`;
		const embed = await mediawiki({
			baseURL: `https://${wiki}.${baseURL}`,
			query,
			searchLink,
			defaultImage: fandomLogo,
			onlyDescription: args.only_description ?? false,
			notFound: {
				title: `No results found for '${args.query}'`,
				description: `[Try searching for it](${searchLink})`
			},
			customErrDescription: "Most likely the Fandom wiki you provided doesn't exist."
		});
		await interaction.editReply({ embeds: [embed] });
	}
};
