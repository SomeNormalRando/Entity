"use strict";
const Discord = require("discord.js");
const { config, Util } = require("../../index.js");

const subreddits = { memes: 5, dankmemes: 3, me_irl: 1, AdviceAnimals: 1 };
const choices = [];

for (const sub of Object.keys(subreddits)) {
	choices.push({ name: sub, value: sub });
}
module.exports = {
	data: {
		name: "meme",
		description: "Random memes from Reddit",
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
	async execute(interaction, args) {
		await interaction.deferReply();
		const result = await getPost(args.subreddit);

		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColour)
			.setTitle(result.title)
			.setURL(`https://reddit.com${result.permalink}`)
			.setImage(result.url)
			.setTimestamp()
			.setFooter(`From ${result.subreddit_name_prefixed}`);
		interaction.editReply({ embeds: [embed] });
	}
};
async function getPost(subreddit = Util.fillArray(subreddits).random()) {
	const result = await require("node-fetch")(`https://reddit.com/r/${subreddit}/random/.json`).then(response => response.json());
	const data = result[0].data.children[0].data;
	if (data.over_18 || data.is_video || !data.url || !data.permalink) return getPost(subreddit);
	return data;
}
