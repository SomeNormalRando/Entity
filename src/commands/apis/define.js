"use strict";
const Discord = require("discord.js");
const fetch = require("node-fetch");

const { config, Util: { SlashCommand, trimStr } } = require("../../index.js");
const regex = /\[(.+?)\]/g;
const replaceVal = "$1";
module.exports = {
	data: new SlashCommand({
		name: "define",
		description: "Get definitions of a word from Urban Dictionary",
		options: [{
			name: "term",
			description: "The term(s) to search on Urban Dictionary",
			type: "STRING",
			required: true
		}]
	}),
	async execute(interaction, args) {
		const term = args.term;
		await interaction.deferReply();
		const embed = new Discord.MessageEmbed()
			.setColor(config.embedColour)
			.setTimestamp()
			.setFooter(`Requested by ${interaction.user.tag}`, `${interaction.user.displayAvatarURL({ dynamic: true })}`);
		const query = encodeURIComponent(term);

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?term=${query}`)
			.then(response => response.json())
			.catch(error => console.error(error));

		if (!list || !list.length) {
			embed.addField(`No results found for "${term}"`, `[Try searching for it](https://www.urbandictionary.com/define.php?${query})`);
			return interaction.editReply({ embeds: [embed] });
		}
		const [answer] = list;
		const linkStr = `[...](${answer.permalink})`;

		embed
			.setTitle(trimStr(answer.word, 256, "..."))
			.setURL(answer.permalink)
			.addFields(
				{ name: "Definition", value: trimStr(answer.definition, 1024, linkStr).replace(regex, replaceVal) },
				{ name: "Example", value: trimStr(answer.example, 1024, linkStr).replace(regex, replaceVal) },
				{ name: "Rating", value: `${answer.thumbs_up} 👍, ${answer.thumbs_down} 👎.` },
				{ name: "Written On", value: trimStr(answer.written_on.substring(0, 10), 1024, linkStr) },
			);
		interaction.editReply({ embeds: [embed] });
	}
};
