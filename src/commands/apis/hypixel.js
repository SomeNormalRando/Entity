"use strict";
const { Util: { SlashCommand } } = require("../../index.js");
const { readdirSync } = require("fs");
const { Collection } = require("discord.js");

const subcommands = new Collection();
for (const file of readdirSync(`${__dirname}/hypixel`).filter(f => f.endsWith(".js"))) {
	const subcommand = require(`./hypixel/${file}`);
	subcommands.set(file.substring(0, file.length - 3), subcommand);
}
module.exports = {
	data: new SlashCommand({
		name: "hypixel",
		description: "Commands related to the Minecraft server Hypixel",
		options: [
			{
				name: "players",
				description: "Shows online player counts across Hypixel",
				type: "SUB_COMMAND",
			}
		]
	}),
	cooldown: 7,
	async execute(interaction, args) {
		await interaction.deferReply();

		const execute = subcommands.get(args.subcommand);
		await execute(interaction);
	}
};
