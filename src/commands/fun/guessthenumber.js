"use strict";
const Discord = require("discord.js");
const { Util } = require("../../index.js");
function addButtons(start, end, row) {
	for (let i = start; i <= end; i++) {
		row.addComponents(
			new Discord.MessageButton()
				.setCustomId(`${i}`)
				.setLabel(i.toString())
				.setStyle("SECONDARY"),
		);
	}
}
module.exports = {
	data: {
		name: "guessthenumber",
		description: "A simple guess the number game"
	},
	async execute(interaction) {
		// Generate a random number
		const number = Math.ceil(Math.random() * 12);

		// Construct the embed
		const embed = new Discord.MessageEmbed()
			.setTitle("Guess the number")
			.setDescription("I've generated a random number, try to guess what it is by clicking on the buttons below.")
			.setTimestamp();

		// Construct action rows
		const row1 = new Discord.MessageActionRow(),
			row2 = new Discord.MessageActionRow(),
			row3 = new Discord.MessageActionRow();
		// Add buttons to the rows
		addButtons(1, 4, row1);
		addButtons(5, 8, row2);
		addButtons(9, 12, row3);

		// Send the first reply
		await interaction.reply({ embeds: [embed], components: [row1, row2, row3] }).then(async () => {
			const time = 30000;
			const message = await interaction.fetchReply();
			let hintsLeft = 2;

			// Make a button collector
			const collector = message.createMessageComponentCollector({ componentType: "BUTTON", time });
			collector.on("collect", i => {
				i.deferUpdate();
				// If the user who clicked the button isn"t the one who started the game
				if (i.user.id !== interaction.user.id) {
					return i.reply({ content: "You aren't the one playing this game.", ephemeral: true });
				}
				const clickedNum = parseInt(i.customId, 10);
				if (clickedNum === number) {
					collector.stop();
					Util.disableButtons("_all", [row1, row2, row3]);
					Util.changeButtonStyle(number.toString(), "SUCCESS", [row1, row2, row3]);

					embed.setDescription("You guessed the number!");
					interaction.editReply({ embeds: [embed], components: [row1, row2, row3] });
				} else if (hintsLeft < 1) {
					collector.stop();
					Util.disableButtons("_all", [row1, row2, row3]);
					Util.changeButtonStyle(number.toString(), "DANGER", [row1, row2, row3]);

					embed.setDescription(`You lost the game. The number was ${number}.`);
					interaction.editReply({ embeds: [embed], components: [row1, row2, row3] });
				} else {
					const hint = clickedNum < number ? "low" : "high";
					Util.disableButtons(clickedNum.toString(), [row1, row2, row3]);

					Util.changeButtonStyle(clickedNum.toString(), "DANGER", [row1, row2, row3]);

					embed.setDescription(`Your last number was too ${hint}. Try again.`);
					interaction.editReply({ embeds: [embed], components: [row1, row2, row3] });
					hintsLeft -= 1;
				}
			});

			setTimeout(() => {
				if (!collector.ended) {
					collector.stop();
					Util.disableButtons("_all", [row1, row2, row3]);

					embed.setDescription(`You took too long to respond. The number was ${number}.`);
					interaction.editReply({ embeds: [embed], components: [row1, row2, row3] });
				}
			}, time);
		});
	},
};
