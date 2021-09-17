module.exports = {
	data: {
		name: "lmgtfy",
		description: "Generates a LMGTFY (Let Me Google That For You) link",
		options: [{
			name: "query",
			description: "The search query",
			type: "STRING",
			required: true
		}]
	},
	async execute(interaction, args) {
		const link = "https://letmegooglethat.com?q=";
		const query = encodeURIComponent(args.query);
		interaction.reply(link + query);
	},
};