"use strict";
const { Util: { SlashCommand } } = require("../../index");
module.exports = {
	data: new SlashCommand({
		name: "settings",
		description: "Change/view your user settings",
		options: [
			{
				name: "list",
				description: "List all the available settings, their options, and your current option for them",
				type: "SUB_COMMAND"
			},
			{
				name: "change",
				description: "Change a specific setting",
				type: "SUB_COMMAND",
				options: [
					{
						name: "name",
						description: "Name of the setting to change",
						type: "STRING",
						required: true
					},
					{
						name: "value",
						description: "Value to change the setting to",
						type: "INTEGER",
						required: true
					}
				]
			}
		]
	}),
	cooldown: 5,
	async execute(interaction) {
		await interaction.reply("Coming soon");
	}
};
