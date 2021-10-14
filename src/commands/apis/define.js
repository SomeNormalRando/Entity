"use strict";
const Discord = require("discord.js");
const fetch = require("node-fetch");
const { config, Util: { SlashCommand, trimStr, disableButtons } } = require("../../index.js");

const logo = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/UD_logo-01.svg/1920px-UD_logo-01.svg.png";
const id_last = "define_last";
const id_next = "define_next";
const templateRow = new Discord.MessageActionRow().addComponents(
	new Discord.MessageButton()
		.setCustomId(id_last)
		.setLabel("◀")
		.setStyle("PRIMARY"),
	new Discord.MessageButton()
		.setCustomId(id_next)
		.setLabel("▶")
		.setStyle("PRIMARY")
);
Object.freeze(templateRow);
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
		const term = args.term;
		await interaction.deferReply();

		const query = encodeURIComponent(term);
		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?term=${query}`)
			.then(response => response.json())
			.catch(error => console.error(error));

		if (!list || !list.length) {
			const embed = new Discord.MessageEmbed()
				.setColor(config.embedColour)
				.addField(
					`No results found for "${term}"`,
					`[Try searching for it](https://www.urbandictionary.com/define.php?term=${query})`
				)
				.setTimestamp()
				.setFooter("Powered by Urban Dictionary", logo);
			return interaction.editReply({ embeds: [embed] });
		}

		let currentPage = 0;
		const firstEmbed = genEmbed(list, currentPage);

		let [firstRow] = disableButtons(id_last, new Discord.MessageActionRow(templateRow));

		if (list.length <= 1) [firstRow] = disableButtons(id_next, firstRow);

		interaction.editReply({ embeds: [firstEmbed], components: [firstRow] }).then(message => {
			let embed;
			const collector = message.createMessageComponentCollector({ componentType: "BUTTON", time });
			collector.on("collect", i => {
				if (i.user.id !== interaction.user.id) return i.reply({ content: "You aren't the one running this command.", ephemeral: true });
				i.deferUpdate();
				if (i.customId === id_last) {
					if (currentPage < 0) return interaction.followUp("An error occured.");

					embed = genEmbed(list, currentPage -= 1);
					let [row] = [new Discord.MessageActionRow(templateRow)];
					if (currentPage === 0) [row] = disableButtons(id_last, row);

					interaction.editReply({ embeds: [embed], components: [row] });
				} else if (i.customId === id_next) {
					if (currentPage > list.length) return interaction.followUp("An error occured.");

					embed = genEmbed(list, currentPage += 1);
					let [row] = [new Discord.MessageActionRow(templateRow)];
					if (currentPage === list.length - 1) [row] = disableButtons(id_next, row);

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
	}
};
const regex = /\[(.+?)\]/g;
const replaceVal = "$1";
function genEmbed(list, currentPage) {
	const definition = list[currentPage];
	const linkStr = `[...](${definition.permalink})`;

	const newEmbed = new Discord.MessageEmbed()
		.setTitle(trimStr(definition.word, 256, "..."))
		.setURL(definition.permalink)
		.addFields(
			{ name: "Definition", value: trimStr(definition.definition, 1024, linkStr).replace(regex, replaceVal) || "[Empty]" },
			{ name: "Example", value: trimStr(definition.example, 1024, linkStr).replace(regex, replaceVal) || "[Empty]" },
			{ name: "Rating", value: `${definition.thumbs_up} 👍, ${definition.thumbs_down} 👎.` || "[Empty]" },
			{ name: "Written", value: Discord.Formatters.time(Date.parse(new Date(definition.written_on)) / 1000, "R") || "[Empty]" },
		)
		.setColor(config.embedColour)
		.setTimestamp()
		.setFooter(`Powered by Urban Dictionary | Page ${currentPage + 1}/${list.length}`, logo);
	return newEmbed;
}
