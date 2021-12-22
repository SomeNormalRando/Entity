"use strict";
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { Util: { disableButtons, addS }, Constants: { EMBED_COLOUR } } = require("../../index.js");

const wait = require("node:util").promisify(setTimeout);

const time = 7500;
const idYes = "purge_yes";
const idNo = "purge_no";
module.exports = {
	data: {
		name: "purge",
		description: "Bulk delete messages",
		options: [{
			name: "amount",
			description: "The amount of messages to purge",
			type: "INTEGER",
			required: true
		}]
	},
	guildOnly: true,
	userPerms: ["MANAGE_MESSAGES"],
	async execute(interaction, args) {
		const embed = new MessageEmbed().setColor(EMBED_COLOUR);
		if (!interaction.channel.permissionsFor(interaction.guild.me).has("MANAGE_MESSAGES")) {
			embed
				.setTitle("I don't have sufficient permissions")
				.setDescription("I need the Manage Messages permission in this channel to purge messages.");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		const { amount } = args;

		let row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(idYes)
					.setLabel("Yes")
					.setStyle("DANGER"),
				new MessageButton()
					.setCustomId(idNo)
					.setLabel("No")
					.setStyle("SECONDARY")
			);

		embed
			.setTitle(`Are you sure you want to delete ${amount} message${addS(amount)} in #${interaction.channel.name}?`)
			.setDescription("This action cannot be undone.");
		// Initial confirmation reply
		const message = await interaction.reply({
			embeds: [embed],
			components: [row],
			fetchReply: true
		});

		// Collect confirmation buttons
		const collector = message.createMessageComponentCollector({ componentType: "BUTTON", time });

		collector.on("collect", async i => {
			if (i.user.id !== interaction.user.id) return i.reply({ content: "You aren't the one running this command.", ephemeral: true });

			await i.deferUpdate();
			// If the user clicked `Yes`
			if (i.customId === idYes) {
				[row] = disableButtons("_all", row);
				const deleted = await interaction.channel.bulkDelete(args.amount, true).catch(error => console.error(error));

				const msg = await interaction.channel.send({ content: `Deleted ${deleted.size} message${addS(amount)}.`, rows: [row] });
				await wait(time);

				await msg.delete();
			// else if the user clicked `No`
			} else if (i.customId === idNo) {
				[row] = disableButtons("_all", row);
				await interaction.editReply({ content: "No messages deleted.", components: [row] });
			}
			collector.stop();
		});
		setTimeout(() => {
			if (!message.deleted) {
				[row] = disableButtons("_all", row);
				interaction.editReply({ content: "No messages were deleted because you took too long to respond.", components: [row] });
			}
		}, time);
	}
};
