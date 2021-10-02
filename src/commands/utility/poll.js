"use strict";
const Discord = require("discord.js");
const emojiNumbers = {
	1: "1️⃣",
	2: "2️⃣",
	3: "3️⃣",
	4: "4️⃣",
	5: "5️⃣",
	6: "6️⃣",
	7: "7️⃣",
	8: "8️⃣",
	9: "9️⃣",
	10: "🔟"
};
module.exports = {
	data: {
		name: "poll",
		description: "Make a yes/no or multiple choice poll",
		options: [
			{
				name: "yesno",
				description: "Make a yes/no poll",
				type: "SUB_COMMAND",
				options: [{
					name: "title",
					description: "Title of the poll to make",
					type: "STRING",
					required: true
				}]
			},
			{
				name: "multiplechoice",
				description: "Make a multiple choice poll",
				type: "SUB_COMMAND",
				options: [
					{
						name: "title",
						description: "Title of the poll to make",
						type: "STRING",
						required: true
					},
					{
						name: "choice1",
						description: "The first choice",
						type: "STRING",
						required: true
					},
					{
						name: "choice2",
						description: "The second choice",
						type: "STRING",
						required: true
					},
					{
						name: "choice3",
						description: "The third choice",
						type: "STRING",
						required: false
					},
					{
						name: "choice4",
						description: "The fourth choice",
						type: "STRING",
						required: false
					},
					{
						name: "choice5",
						description: "The fifth choice",
						type: "STRING",
						required: false
					},
					{
						name: "choice6",
						description: "The sixth choice",
						type: "STRING",
						required: false
					},
					{
						name: "choice7",
						description: "The seventh choice",
						type: "STRING",
						required: false
					},
					{
						name: "choice8",
						description: "The eighth choice",
						type: "STRING",
						required: false
					},
					{
						name: "choice9",
						description: "The ninth choice",
						type: "STRING",
						required: false
					},
					{
						name: "choice10",
						description: "The tenth choice",
						type: "STRING",
						required: false
					}
				]
			}
		]
	},
	async execute(interaction, args) {
		const title = interaction.options.getString("title");
		const embed = new Discord.MessageEmbed()
			.setTitle(title)
			.setColor("#2F3136")
			.setFooter(`Poll by ${interaction.user.tag}`);
		if (args.subcommand === "yesno") {
			await interaction.reply({ embeds: [embed] })
				.then(async () => {
					const sentMsg = await interaction.fetchReply();
					await sentMsg.react("👍");
					await sentMsg.react("👎");
				}).catch(err => console.error(err));
		} else if (args.subcommand === "multiplechoice") {
			let description = "";
			const emojisToReact = [];
			for (let i = 1; i <= 10; i++) {
				const currentChoice = interaction.options.getString(`choice${i}`);
				if (currentChoice) {
					const currentEmoji = `${emojiNumbers[i]}`;
					description += `\n${currentEmoji} ${currentChoice}`;
					emojisToReact.push(currentEmoji);
				}
			}
			embed.setDescription(description);
			await interaction.reply({ embeds: [embed] })
				.then(async () => {
					const sentMsg = await interaction.fetchReply();
					emojisToReact.forEach(async element => {
						await sentMsg.react(element);
					});
				}).catch(err => console.error(err));
		}
	}
};
