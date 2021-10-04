"use strict";
const Discord = require("discord.js");
const { Util } = require("../../index.js");

const time = 7000;
const id_yes = "purge_yes";
const id_no = "purge_no";
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
		const amount = args.amount;


		let row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId(id_yes)
					.setLabel("Yes")
					.setStyle("DANGER"),
				new Discord.MessageButton()
					.setCustomId(id_no)
					.setLabel("No")
					.setStyle("SECONDARY")
			);
		// Confirmation reply
		const message = await interaction.reply({
			content: `Are you sure you want to delete ${amount} message${amount === 1 ? "" : "s"} in ${interaction.channel.toString()}?`,
			components: [row],
			fetchReply: true
		});

		// Confirmation buttons
		const collector = message.createMessageComponentCollector({ componentType: "BUTTON", time });

		collector.on("collect", i => {
			if (i.user.id !== interaction.user.id) return i.reply({ content: "You aren't the one running this command.", ephemeral: true });
			i.deferUpdate();
			if (i.customId === id_yes) {
				[row] = Util.disableButtons("_all", row);
				interaction.channel.bulkDelete(args.amount, true)
					.then(deletedAmount => {
						interaction.channel.send({ content: `Deleted ${deletedAmount.size} message${amount === 1 ? "" : "s"}.`, rows: [row] })
							.then(msg => setTimeout(() => {
								msg.delete();
							}, 3000));
					})
					.catch(error => {
						console.error(error);
					});
			} else if (i.customId === id_no) {
				[row] = Util.disableButtons("_all", row);
				interaction.editReply({ content: "No messages deleted.", components: [row] })
					.then(msg => setTimeout(() => msg.delete(), 3000));
			}
			collector.stop();
		});
		setTimeout(() => {
			if (!message.deleted) {
				[row] = Util.disableButtons("_all", row);
				interaction.editReply({ content: "No messages were deleted because you took too long to respond.", components: [row] });
			}
		}, time);
	}
};
