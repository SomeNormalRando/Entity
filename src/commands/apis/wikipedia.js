"use strict";
const fetch = require("node-fetch");
const Discord = require("discord.js");

const { config } = require("../../index.js");
const { Util: { SlashCommand, trimStr } } = require("../../index");
const wikipediaLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wikipedia-logo-v2-en.svg/1200px-Wikipedia-logo-v2-en.svg.png";

module.exports = {
	data: new SlashCommand({
		name: "wikipedia",
		description: "Search stuff on Wikipedia",
		options: [{
			name: "query",
			description: "The search query to search Wikipedia for",
			type: "STRING",
			required: true
		}]
	}),
	cooldown: 7,
	async execute(interaction, args) {
		await interaction.deferReply();

		// eslint-disable-next-line max-len

		const query = encodeURIComponent(args.query);
		const searchLink = `https://en.wikipedia.org?search=${query}`;

		const rawResult = await fetch(
			`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&titles=${query}&explaintext`
		).then(response => response.json());

		let result = rawResult.query.pages;
		result = result[Object.keys(result)[0]];

		let extract = result.extract;

		const embed = new Discord.MessageEmbed().setColor(config.embedColour).setThumbnail(wikipediaLogo);
		if (!extract) {
			embed
				.setTitle(trimStr(`No results found for '${args.query}'`, "...", 256))
				.setDescription(trimStr(`[Try searching for it](${searchLink})`, 4096));
			return interaction.editReply({ embeds: [embed], ephemeral: true });
		}

		// Split text into array so that each element starts with a heading
		extract = extract.split(/^==\s/m);
		embed
			.setTitle(trimStr(result.title, 256, "..."))
			.setURL(searchLink)
			.setDescription(trimStr(extract[0], 4096, `[...more](${searchLink})`));

		extract.shift();
		for (const section of extract) {
			let heading = section.match(/.+?\s==/)[0];
			let content = section.substring(heading.length);
			if (content.trim() && heading) {
				heading = heading.replace(/^(.+?)\s==/, "__**$1**__");
				content = trimStr(content, 1024, `[...](${searchLink})`)
					.replace(/^=== (.+?) ===/gm, "**$1**")
					.replace(/^==== (.+?) ====/gm, "__$1__");

				if (embed.length + heading.length + content.length > 6000) break;
				embed.addField(trimStr(heading, 256, "..."), content);
			}
		}
		await interaction.editReply({ embeds: [embed] }).catch(async err => {
			console.error(err);
			await interaction.editReply("An error occured.");
		});
	}
};
