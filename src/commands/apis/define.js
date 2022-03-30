"use strict";
const Discord = require("discord.js");
const {
	Constants: { EMBED_COLOUR, EMBED_LIMITS },
	Util: { SlashCommand, disableButtons, trimStr, createErrorEmbed, fetchResource }
} = require("../../index.js");

const logo = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Urban_Dictionary_logo.svg/1920px-Urban_Dictionary_logo.svg.png";
const idLast = "define_last";
const idNext = "define_next";
const templateRow = new Discord.MessageActionRow().addComponents(
	new Discord.MessageButton()
		.setCustomId(idLast)
		.setLabel("◀")
		.setStyle("PRIMARY"),
	new Discord.MessageButton()
		.setCustomId(idNext)
		.setLabel("▶")
		.setStyle("PRIMARY")
);
const time = 60000;
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
	cooldown: 7,
	async execute(interaction, args) {
		await interaction.deferReply();
		const { term } = args;
		const query = encodeURIComponent(term);

		fetchResource(`https://api.urbandictionary.com/v0/define?term=${query}`).then(({ list }) => {
			if (!list || !list.length) {
				const embed = new Discord.MessageEmbed()
					.setColor(EMBED_COLOUR)
					.addField(
						`No results found for "${term}"`,
						`[Try searching for it](https://www.urbandictionary.com/define.php?term=${query})`
					)
					.setTimestamp()
					.setFooter({ text: "Powered by Urban Dictionary", iconURL: logo });
				return interaction.editReply({ embeds: [embed] });
			}

			let currentPage = 0;
			const firstEmbed = genEmbed(list, currentPage);

			let [firstRow] = disableButtons(idLast, new Discord.MessageActionRow(templateRow));

			if (list.length <= 1) [firstRow] = disableButtons(idNext, firstRow);

			interaction.editReply({ embeds: [firstEmbed], components: [firstRow] }).then(message => {
				let embed = firstEmbed;
				const collector = message.createMessageComponentCollector({ componentType: "BUTTON", time });
				collector.on("collect", i => {
					if (i.user.id !== interaction.user.id) return i.reply({ content: "You aren't the one running this command.", ephemeral: true });
					i.deferUpdate();
					if (i.customId === idLast) {
						if (currentPage < 0) return interaction.followUp("An error occurred.");

						embed = genEmbed(list, currentPage -= 1);
						let row = new Discord.MessageActionRow(templateRow);
						if (currentPage === 0) [row] = disableButtons(idLast, row);

						interaction.editReply({ embeds: [embed], components: [row] });
					} else if (i.customId === idNext) {
						if (currentPage > list.length) return interaction.followUp("An error occurred.");

						embed = genEmbed(list, currentPage += 1);
						let row = new Discord.MessageActionRow(templateRow);
						if (currentPage === list.length - 1) [row] = disableButtons(idNext, row);

						interaction.editReply({ embeds: [embed], components: [row] });
					}
				});
				setTimeout(() => {
					const [row] = disableButtons("_all", new Discord.MessageActionRow(templateRow));
					interaction.editReply({ embeds: [embed], components: [row] });
				}, time);
			}).catch(err => {
				console.error(err);
				interaction.editReply("An error occurred.");
			});
		}).catch(_ => interaction.editReply({ embeds: [createErrorEmbed(`while fetching the definition for ${term}`)], ephemeral: true }));
	}
};
const regex = /\[(.+?)\]/g;
const replaceVal = "$1";
function genEmbed(list, pageNum) {
	const currentPg = list[pageNum], linkStr = `[...](${currentPg.permalink})`;

	const definition = trimStr(currentPg.definition, EMBED_LIMITS.FIELD_VALUE, linkStr).replace(regex, replaceVal);
	const example = trimStr(currentPg.example, EMBED_LIMITS.FIELD_VALUE, linkStr).replace(regex, replaceVal);

	const newEmbed = new Discord.MessageEmbed()
		.setTitle(trimStr(currentPg.word, EMBED_LIMITS.TITLE, "..."))
		.setURL(currentPg.permalink)
		.addFields(
			{ name: "Definition", value: definition || "[Empty]" },
			{ name: "Example", value: example || "[Empty]" },
			{ name: "Rating", value: `${currentPg.thumbs_up} 👍, ${currentPg.thumbs_down} 👎.` || "[Empty]" },
			{ name: "Written", value: Discord.Formatters.time(Date.parse(new Date(currentPg.written_on)) / 1000, "R") || "[Empty]" },
		)
		.setColor(EMBED_COLOUR)
		.setTimestamp()
		.setFooter({ text: `Powered by Urban Dictionary | Page ${pageNum + 1}/${list.length}`, iconURL: logo });
	return newEmbed;
}
