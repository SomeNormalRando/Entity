"use strict";
const fetch = require("node-fetch");
const Discord = require("discord.js");
const trim = (str, max, url) => {
	const link = `[......](${url})`;
	return str.length > max ? `${str.slice(0, max - link.length)}${link}` : str;
};
module.exports = {
	data: {
		name: "wikipedia",
		description: "Search stuff on Wikipedia",
		options: [{
			name: "query",
			description: "The search query to search Wikipedia for",
			type: "STRING",
			required: true
		}]
	},
	async execute(interaction, args) {
		await interaction.deferReply();

		// eslint-disable-next-line max-len
		const wikipediaLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wikipedia-logo-v2-en.svg/1200px-Wikipedia-logo-v2-en.svg.png";
		const query = encodeURIComponent(args.query);
		const searchLink = `https://en.wikipedia.org?search=${query}`;

		const rawResult = await fetch(
			`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&titles=${query}&explaintext`
		).then(response => response.json());

		let result = rawResult.query.pages;
		result = result[Object.keys(result)[0]];

		let extract = result.extract;
		const embed = new Discord.MessageEmbed().setThumbnail(wikipediaLogo);
		if (!extract) {
			embed
				.setTitle(`No results found for ${args.query}`)
				.setDescription(`[Try searching for it](${searchLink})`);
			return interaction.editReply({ embeds: [embed], ephemeral: true });
		}

		extract = extract.split(/^==\s/m);
		embed
			.setTitle(result.title)
			.setURL(searchLink)
			.setDescription(trim(extract[0], 4096, searchLink));

		extract.shift();
		for (const section of extract) {
			let heading = section.match(/[\w\s]*\s==/)[0];
			let content = section.substring(heading.length);
			if (content.trim() && heading) {
				content = trim(content, 1024, searchLink);
				heading = heading.replace(/([\w\s]*)\s==/, "$1");
				content = content.replace(/^===\s([\w\s]*)\s===/gm, "__$1__");
				if (embed.length + heading.length + content.length > 6000) return;
				embed.addField(heading, content);
			}
		}
		await interaction.editReply({ embeds: [embed] });
	}
};
