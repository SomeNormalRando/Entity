const Discord = require('discord.js');
const { Util } = require('../../index.js');
module.exports = {
	data: {
		name: 'purge',
		description: 'Bulk delete messages',
		options: [{
			name: 'amount',
			description: 'The amount of messages to purge',
			type: 'INTEGER',
			required: true
		}]
	},
	guildOnly: true,
	userPerms: ['MANAGE_MESSAGES'],
	async execute(interaction, args) {
		const amount = args.amount;
		//Create unique ids based on channel id and current time
		const uniqueId = 'purgeMessages_' + Date.now() + interaction.channel.id;
		const uniqueId_yes = `${uniqueId}_yes`;
		const uniqueId_no = `${uniqueId}_no`;

		const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId(uniqueId_yes)
					.setLabel('Yes')
					.setStyle('DANGER'),
				new Discord.MessageButton()
					.setCustomId(uniqueId_no)
					.setLabel('No')
					.setStyle('SECONDARY')
			);
		//Confirmation reply
		await interaction.reply({
			content: `Are you sure you want to delete ${amount} messages in ${interaction.channel.toString()}?`,
			components: [row]
		});

		const message = await interaction.fetchReply();
		//Determine if user wants to purge or not
		const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 3000 });
		collector.on('collect', i => {
			if (i.user.id !== interaction.user.id) return i.reply({ content: "These buttons aren't for you.", ephemeral: true });
			if (i.customId === uniqueId_yes) {
				Util.disableAllButtons(row);
				interaction.channel.bulkDelete(args.amount, true)
					.then(async deletedAmount => {
						await i.channel.send({ content: `Deleted ${deletedAmount.size} messages.`, rows: [row] })
							.then(msg => setTimeout(() => {
								msg.delete();
							}, 3000));
					})
					.catch(error => {
						console.error(error);
					});
				collector.stop();
			} else if (i.customId === uniqueId_no) {
				Util.disableAllButtons(row);
				i.update({ content: 'No messages deleted.', components: [row] })
					.then(msg => setTimeout(() => {
						msg.delete();
					}, 3000));
				collector.stop();
			}

		});
		collector.on('end', async () => {
			const deleted = await interaction.fetchReply().then(msg => msg.deleted);
			if (deleted) return;
			Util.disableAllButtons(row);
			interaction.editReply({ content: 'No messages were deleted because you took too long to respond.', components: [row] });
		});
	}
};