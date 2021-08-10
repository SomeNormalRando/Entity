/* eslint-disable prefer-const */
const Discord = require('discord.js');
const { disableButtons, disableAllButtons } = require('../../assets/util.js');
function addButtons(start, end, row) {
	for (let i = start; i <= end; i++) {
		row.addComponents(
			new Discord.MessageButton()
				.setCustomId(`${i}`)
				.setLabel(i.toString())
				.setStyle('PRIMARY'),
		);
	}
}
module.exports = {
	name: 'guessthenumber',
	description: 'A simple guess the number game',
	async execute(interaction) {
		//Generate a random number
		const number = Math.floor(Math.random() * 12) + 1;
		//Construct the embed
		const embed = new Discord.MessageEmbed()
			.setTitle('Guess the number')
			.setDescription("I've generated a random number, try to guess what it is by clicking on the buttons below.");
		//Construct action rows
		let row1 = new Discord.MessageActionRow(),
			row2 = new Discord.MessageActionRow(),
			row3 = new Discord.MessageActionRow();
		//Add buttons to the rows
		addButtons(1, 4, row1);
		addButtons(5, 8, row2);
		addButtons(9, 12, row3);
		//Send the first reply
		await interaction.reply({ embeds: [embed], components: [row1, row2, row3] }).then(async () => {
			const time = 30000;
			const message = await interaction.fetchReply();
			let hintsLeft = 2;
			//Make a button collector
			const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: time });
			collector.on('collect', i => {
				i.deferUpdate();
				//If the user who clicked the button isn't the one who started the game
				if (i.user.id != interaction.user.id) {
					return i.reply({ content: "These buttons aren't for you.", ephemeral: true });
				}
				const clickedNum = parseInt(i.customId);
				if (clickedNum == number) {
					collector.stop();
					embed.setDescription('You guessed the number!');
					disableAllButtons(row1, row2, row3);
					interaction.editReply({ embeds: [embed], components: [row1, row2, row3] });
				} else if (hintsLeft < 1) {
					collector.stop();
					embed.setDescription(`You lost the game. The number was ${number}.`);
					disableAllButtons(row1, row2, row3);
					interaction.editReply({ embeds: [embed], components: [row1, row2, row3] });
				}
				else {
					let hint;
					hint = clickedNum < number ? 'low' : 'high';
					embed.setDescription(`Your last number was too ${hint}. Try again.`);
					disableButtons(clickedNum, row1, row2, row3);
					interaction.editReply({ embeds: [embed], components: [row1, row2, row3] });
					hintsLeft--;
				}
			});
			setTimeout(() => {
				if (!collector.ended) {
					collector.stop();
					embed.setDescription(`You took too long to respond. The number was ${number}.`);
					disableAllButtons(row1, row2, row3);
					interaction.editReply({ embeds: [embed], components: [row1, row2, row3] });
				}
			}, time);
		});
	},
};