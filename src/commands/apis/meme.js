"use strict";
const { MessageEmbed } = require("discord.js");
const { Constants: { EMBED_COLOUR }, Util: { createErrorEmbed, fillArray, fetchResource } } = require("../../index.js");
// eslint-disable-next-line camelcase
const subreddits = { memes: 5, dankmemes: 3, me_irl: 2, AdviceAnimals: 1 };
const choices = [];

for (const sub of Object.keys(subreddits)) {
	choices.push({ name: sub, value: sub });
}
const errReply = { embeds: [createErrorEmbed("while fetching your meme", "I couldn't find a meme that could be shown. Please try again.")], ephemeral: true };
module.exports = {
	data: {
		name: "meme",
		description: "Get random memes from Reddit!",
		options: [
			{
				name: "subreddit",
				description: "The subreddit to get the meme from",
				type: "STRING",
				choices,
				required: false
			}
		]
	},
	cooldown: 5,
	async execute(interaction, args) {
		await interaction.deferReply();
		const result = await getPost(args.subreddit);
		if (!result) {
			return interaction.editReply(errReply);
		}

		const embed = new MessageEmbed()
			.setColor(EMBED_COLOUR)
			.setTitle(result.title)
			.setURL(`https://reddit.com${result.permalink}`)
			.setImage(result.url)
			.setTimestamp(result.created * 1000)
			.setFooter(`${result.ups} 👍 • ${result.num_comments} 💬 | From ${result.subreddit_name_prefixed} | Posted on`);
		interaction.editReply({ embeds: [embed] });
	}
};
async function getPost(subreddit = fillArray(subreddits).random()) {
	const result = await fetchResource(`https://reddit.com/r/${subreddit}/random.json`).catch(_ => null);

	if (result === null) return null;

	let data;
	for (let i = 0, len = result[0].data.children.length; i < len; i++) {
		const current = result[0].data.children[i].data;
		if (current.over_18 || !current.url || !current.permalink) {
			continue;
		} else {
			data = current;
			break;
		}
	}
	return data;
}
