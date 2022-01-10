"use strict";
const Discord = require("discord.js");
const {
	Constants: { EMBED_COLOUR, DEVELOPERS },
	Util: { SlashCommand, addS },
	config: { INVITE_LINK },
} = require("../../index");

const adminInvite = INVITE_LINK.replace(/permissions=\d+/, "permissions=8");
const jsURL = "https://en.wikipedia.org/wiki/JavaScript";
const djsURL = "https://discord.js.org";
const sourceURL = "https://github.com/SomeNormalRando/Entity";
module.exports = {
	data: new SlashCommand({
		name: "bot",
		description: "Get bot information/invite link",
		options: [
			{
				name: "invite",
				description: "Get my invite link",
				type: "SUB_COMMAND"
			},
			{
				name: "info",
				description: "Get bot information",
				type: "SUB_COMMAND"
			}
		]
	}),
	cooldown: 3,
	execute(interaction, args) {
		const { client } = interaction;
		const embed = new Discord.MessageEmbed().setColor(EMBED_COLOUR);
		if (args.subcommand === "invite") {
			embed
				.setTitle("Invite link:")
				.setDescription(`[Invite link (normal)](${INVITE_LINK})\n[Invite link (admin)](${adminInvite})`)
				.setTimestamp()
				.setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true }) });
		} else if (args.subcommand === "info") {
			const devNames = [];
			for (const devId of DEVELOPERS) {
				const dev = client.users.cache.get(devId);
				devNames.push(dev.tag);
			}
			embed
				.setTitle("Bot info")
				.setDescription(`Written in [JavaScript](${jsURL}) with [Discord.js](${djsURL}) version ${Discord.version}`)
				.addFields(
					{ name: `Developer${addS(DEVELOPERS)}`, value: devNames.join(", ") },
					{ name: "Total commands", value: `${client.commands.size}`, inline: true },
					{ name: "Source code", value: `[View on GitHub](${sourceURL})`, inline: true },
					{ name: "Server count", value: `${client.guilds.cache.size}`, inline: true },
					{ name: "Uptime", value: `${Math.floor(process.uptime() / 60)} minutes`, inline: true },
					{ name: "Memory usage", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true }
				)
				.setTimestamp()
				.setFooter({ text: `${client.user.tag} | ID: ${client.user.id}`, iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true }) });
		}
		interaction.reply({ embeds: [embed] });
	}
};
