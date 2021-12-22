"use strict";
const baseURL = "https://letmegooglethat.com?q=";
module.exports = {
	data: {
		name: "lmgtfy",
		description: "Generate a LMGTFY (Let Me Google That For You) link",
		options: [{
			name: "query",
			description: "The search query",
			type: "STRING",
			required: true
		}]
	},
	async execute(interaction, args) {
		await interaction.reply(`${baseURL}${encodeURIComponent(args.query)}`);
	},
};
