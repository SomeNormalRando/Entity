const fetch = require("node-fetch");
const Discord = require("discord.js");
module.exports = {
	data: {
		name: "wikipedia",
		description: "Search stuff on Wikipedia",
		options: [{
			name: "query",
			description: "The search query to search Wikipedia for",
			type: "STRING",
			required: true
		}]
	},
	async execute(interaction, args) {
		await interaction.deferReply();
		const wikipediaLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wikipedia-logo-v2-en.svg/1200px-Wikipedia-logo-v2-en.svg.png";
		const query = encodeURIComponent(args.query);
		const link = `https://en.wikipedia.org?search=${query}`;
		const result = await fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&titles=${query}&explaintext`)
			.then(response => response.json());

		let pages = result.query.pages;
		pages = pages[Object.keys(pages)[0]];

		let extract = pages.extract;
		if (!extract) {
			const embed = new Discord.MessageEmbed()
				.setTitle(`No results found for ${args.query}`)
				.setThumbnail(wikipediaLogo)
				.setDescription(`[Try searching for it](${link})`);
			return interaction.editReply({ embeds: [embed], ephemeral: true });
		}

		// Bold and underline primary headings, bold secondary headings

		// Primary headings look like this: == Primary ==
		extract = extract.replace(/^==\s([\w\s]*)\s==/gm, "__**$1**__");
		// Secondary headings look like this: === Secondary ===
		extract = extract.replace(/^===\s([\w\s]*)\s===/gm, "**$1**");


		const continueReading = `... [continue reading](${link})`;
		extract = Discord.Util.splitMessage(extract, { maxLength: 4096 - continueReading.length })[0];

		const embed = new Discord.MessageEmbed()
			.setTitle(pages.title)
			.setThumbnail(wikipediaLogo)
			.setURL(link)
			.setDescription(extract + continueReading);
		await interaction.editReply({ embeds: [embed] });
	}
};