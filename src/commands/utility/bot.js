"use strict";
const Discord = require("discord.js");
const { Util: { SlashCommand }, config: { INVITE_LINK, EMBED_COLOUR }, env: { OWNERS } } = require("../../index");

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
				.setFooter(client.user.tag, client.user.displayAvatarURL({ format: "png", dynamic: true }));
		} else if (args.subcommand === "info") {
			const me = client.users.cache.get(OWNERS[0]);
			embed
				.setTitle("Bot info")
				.setDescription(`Written in [JavaScript](${jsURL}) with [Discord.js](${djsURL}) version ${Discord.version}`)
				.addFields(
					{ name: "Owner", value: `${me.tag} (${me.toString()})` },
					{ name: "Servers", value: `${client.guilds.cache.size}` },
					{ name: "Total commands", value: `${client.commands.size}` },
					{ name: "Source code", value: `[View on GitHub](${sourceURL})` }
				)
				.setTimestamp()
				.setFooter(`${client.user.tag} | ID: ${client.user.id}`, client.user.displayAvatarURL({ format: "png", dynamic: true }));
		}
		interaction.reply({ embeds: [embed] });
	}
};
