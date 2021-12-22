"use strict";
const Discord = require("discord.js");
const { Constants: { EMBED_COLOUR }, Util: { createErrorEmbed, fetchResource, SlashCommand } } = require("../../index.js");

// ? `url` is the URL to fetch, `fn` is a function extracting the image from the result
// ? `start` and `end` are arrays to pick a random element from for the embed title
// ? `credit` is the site to credit in the footer
const URLs = {
	cat: {
		url: "https://aws.random.cat/meow",
		fn: res => res.file,
		start: ["Meow", "Meeow", "Meoow", "Meeoow", "Meoww"],
		end: ["!", "...", "...!"],
		credit: "random.cat"
	},
	dog: {
		url: "https://random.dog/woof.json",
		fn: res => res.url,
		start: ["Woof", "Wooof", "Woooof"],
		end: ["!", "...", "...!"],
		credit: "random.dog"
	},
	bird: {
		url: "https://shibe.online/api/birds",
		fn: res => res[0],
		start: ["Chirp!", "Here's a random bird", "🐦🐦", "🦜🦜"],
		credit: "shibe.online"
	},
	shiba: {
		url: "https://shibe.online/api/shibes",
		fn: res => res[0],
		start: ["Woof", "Wooof", "Woooof"],
		end: ["!", "...", "...!"],
		credit: "shibe.online"
	},
	fox: {
		url: "https://randomfox.ca/floof",
		fn: res => res.image,
		start: ["🦊", "🦊 Here's a fox! 🦊", "🦊🦊🦊"],
		credit: "randomfox.ca"
	}
};

module.exports = {
	data: new SlashCommand({
		name: "animal",
		description: "See some random animals",
		options: [
			{
				name: "bird",
				description: "Get a random bird",
				type: "SUB_COMMAND",
			},
			{
				name: "shiba",
				description: "Get a random Shiba Inu",
				type: "SUB_COMMAND",
			},
			{
				name: "fox",
				description: "Get a random fox",
				type: "SUB_COMMAND",
			},
		]
	}),
	cooldown: 5,
	async execute(interaction, args) {
		await interaction.deferReply();

		fetchAnimal(args.subcommand, interaction);
	},
};
function fetchAnimal(animal, interaction) {
	const { url, fn, start, end = [""], credit } = URLs[animal];

	fetchResource(url).then(result => {
		const image = fn(result);

		const embed = new Discord.MessageEmbed()
			.setTitle(start.random() + end.random())
			.setColor(EMBED_COLOUR)
			.setImage(image)
			.setTimestamp()
			.setFooter(`Powered by ${credit}`);

		interaction.editReply({ embeds: [embed] });
	}).catch(_ => interaction.editReply({
		embeds: [createErrorEmbed(`while fetching your ${animal}`)], ephemeral: true
	}));
}
