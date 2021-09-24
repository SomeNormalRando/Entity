"use strict";
module.exports = {
	data: {
		name: "say",
		description: "Make the bot say something of your choice",
		options: [{
			name: "content",
			type: "STRING",
			description: "The content to make the bot say",
			required: true,
		}]
	},
	async execute(interaction, args) {
		await interaction.reply(args.content);
	},
};
