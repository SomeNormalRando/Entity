"use strict";
const Discord = require("discord.js");
const fetch = require("node-fetch");
const { config } = require("../../index.js");
const trim = (str, max) => {
	str = str.replace(/\[(.+?)\](\W|$)/gm, "$1$2");
	return str.length > max ? `${str.slice(0, max - 3)}...` : str;
};
module.exports = {
	data: {
		name: "define",
		description: "Get definitions of a word from Urban Dictionary",
		options: [{
			name: "term",
			description: "The term(s) to search on Urban Dictionary",
			type: "STRING",
			required: true
		}]
	},
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

		embed
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addFields(
				{ name: "Definition", value: trim(answer.definition, 1024) },
				{ name: "Example", value: trim(answer.example, 1024) },
				{ name: "Rating", value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.` },
				{ name: "Written On", value: trim(answer.written_on.substring(0, 10), 1024) },
			);
		interaction.editReply({ embeds: [embed] });
	}
};
