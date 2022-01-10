"use strict";
const { MessageEmbed } = require("discord.js");
const { Constants: { EMBED_COLOUR, EMBED_LIMITS }, Util: { createErrorEmbed, fetchResource, trimStr } } = require("../index");

/**
 * Fetches a page from a URL that uses MediaWiki and formats it into an embed
 * @param {Object} options Options
 * @param {String} options.baseURL The base Mediawiki URL to fetch from
 * @param {String} options.query The query to search the page for
 * @param {String} options.searchLink Search link
 * @param {String} options.defaultImage A URL to a default image to be used when no page image could be found
 * @param {Boolean} [options.onlyDescription=false] Whether to only return the description

 * @param {Object} options.notFound Options for the embed when a page is not found
 * @param {String} options.notFound.title Embed title
 * @param {String} options.notFound.description Embed description
 * @param {String} [options.customErrDescription=] A custom description for the embed if an error occurs
 * @returns {Promise<MessageEmbed>} The embed
 */
module.exports = async function getMediawikiPage(options) {
	const { baseURL, query, searchLink, defaultImage, onlyDescription = false, notFound, customErrDescription } = options;

	// cspell:disable-next-line
	const result = await fetchResource(`${baseURL}?format=json&action=query&prop=extracts&exlimit=max&titles=${query}&explaintext`).catch(_ => null);

	if (result === null) {
		if (customErrDescription) {
			return createErrorEmbed("", customErrDescription);
		}
		return { embeds: [createErrorEmbed()], ephemeral: true };
	}
	const { query: { pages } } = result;

	// eslint-disable-next-line prefer-const
	let { title, extract } = pages[Object.keys(pages)[0]];

	const embed = new MessageEmbed()
		.setColor(EMBED_COLOUR)
		.setTimestamp();
	if (!extract) {
		embed
			.setTitle(trimStr(notFound.title, EMBED_LIMITS.TITLE, "..."))
			.setDescription(trimStr(notFound.description, EMBED_LIMITS.DESCRIPTION, "..."))
			.setThumbnail(defaultImage);
		return embed;
	}

	// Split text into array so that each element starts with a heading
	extract = extract.split(/^==\s/m);
	embed
		.setTitle(trimStr(title, EMBED_LIMITS.TITLE, "..."))
		.setURL(searchLink)
		.setDescription(trimStr(extract[0], EMBED_LIMITS.DESCRIPTION, `[...more](${searchLink})`))
		.setThumbnail(await pageImage(baseURL, title) || defaultImage);
	if (onlyDescription === true) {
		embed.setFooter({ text: "Description-only mode" });
		return embed;
	}

	extract.shift();

	// eslint-disable next-line
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

	return embed;
};
async function pageImage(baseURL, title) {
	const result = await fetchResource(`${baseURL}?action=query&titles=${title}&prop=pageimages&pithumbsize=1000&format=json`).catch(_ => null);
	if (result === null) return null;

	const { query: { pages } } = result;
	const { thumbnail } = pages[Object.keys(pages)[0]];

	return thumbnail?.source || null;
}
