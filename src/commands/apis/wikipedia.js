"use strict";
const Discord = require("discord.js");
const { config: { EMBED_COLOUR, EMBED_LIMITS }, Util: { SlashCommand, createErrorEmbed, fetchResource, trimStr } } = require("../../index.js");

const wikipediaLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wikipedia-logo-v2-en.svg/1200px-Wikipedia-logo-v2-en.svg.png";
const baseUrl = "https://en.wikipedia.org/w/api.php";
const errReply = { embeds: [createErrorEmbed()], ephemeral: true };
module.exports = {
	data: new SlashCommand({
		name: "wikipedia",
		description: "Search stuff on Wikipedia!",
		options: [{
			name: "query",
			description: "The query to search Wikipedia for",
			type: "STRING",
			required: true
		}]
	}),
	cooldown: 7,
	async execute(interaction, args) {
		await interaction.deferReply();

		const query = encodeURIComponent(args.query);
		const searchLink = `https://en.wikipedia.org?search=${query}`;

		fetchResource(`${baseUrl}?format=json&action=query&prop=extracts&exlimit=max&titles=${query}&explaintext`).then(result => {
			const { pages } = result.query;

			// eslint-disable-next-line prefer-const
			let { title, extract } = pages[Object.keys(pages)[0]];

			const embed = new Discord.MessageEmbed().setColor(EMBED_COLOUR).setThumbnail(wikipediaLogo);
			if (!extract) {
				embed
					.setTitle(trimStr(`No results found for '${args.query}'`, EMBED_LIMITS.TITLE, "..."))
					.setDescription(trimStr(`[Try searching for it](${searchLink})`, EMBED_LIMITS.DESCRIPTION, "..."));
				return interaction.editReply({ embeds: [embed], ephemeral: true });
			}

			// Split text into array so that each element starts with a heading
			extract = extract.split(/^==\s/m);
			embed
				.setTitle(trimStr(title, EMBED_LIMITS.TITLE, "..."))
				.setURL(searchLink)
				.setDescription(trimStr(extract[0], EMBED_LIMITS.DESCRIPTION, `[...more](${searchLink})`));

			extract.shift();

			for (const section of extract) {
				let [heading] = section.match(/.+?\s==/),
					content = section.substring(heading.length);
				if (content.trim() && heading) {
					heading = heading.replace(/^(.+?)\s==/, "__**$1**__");
					content = trimStr(content, EMBED_LIMITS.FIELD_VALUE, `[...](${searchLink})`)
						.replace(/^=== (.+?) ===/gm, "**$1**")
						.replace(/^==== (.+?) ====/gm, "__$1__");

					if (embed.length + heading.length + content.length > EMBED_LIMITS.TOTAL_CHARACTERS) break;
					embed.addField(trimStr(heading, EMBED_LIMITS.FIELD_NAME, "..."), content);
				}
			}

			interaction.editReply({ embeds: [embed] }).catch(err => {
				console.error(err);
				interaction.editReply(errReply);
			});
		}).catch(_ => interaction.reply(errReply));
	}
};
