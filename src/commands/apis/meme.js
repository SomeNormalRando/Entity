"use strict";
const Discord = require("discord.js");
const { config, Util } = require("../../index.js");

const subreddits = { memes: 5, dankmemes: 3, me_irl: 2, AdviceAnimals: 1 };
const choices = [];

for (const sub of Object.keys(subreddits)) {
	choices.push({ name: sub, value: sub });
}
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
	async execute(interaction, args) {
		await interaction.deferReply();
		const result = await getPost(args.subreddit);

		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColour)
			.setTitle(result.title)
			.setURL(`https://reddit.com${result.permalink}`)
			.setImage(result.url)
			.setTimestamp(result.created * 1000)
			.setFooter(`${result.ups} 👍 • ${result.num_comments} 💬 | From ${result.subreddit_name_prefixed} | Posted on`);
		interaction.editReply({ embeds: [embed] });
	}
};
async function getPost(subreddit = Util.fillArray(subreddits).random()) {
	const result = await require("node-fetch")(`https://reddit.com/r/${subreddit}/random.json`).then(response => response.json());
	let data;
	for (let i = 0, l = result[0].data.children.length; i < l; i++) {
		const temp = result[0].data.children[i].data;
		if (temp.over_18 || temp.is_video || !temp.url || !temp.permalink) {
			continue;
		} else {
			data = temp;
			break;
		}
	}
	data ??= getPost(subreddit);
	return data;
}
