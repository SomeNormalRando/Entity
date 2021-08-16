"use strict";
const Discord = require("discord.js");
const {	Counting } = require("../database/dbIndex.js");
module.exports = {
	name: "messageCreate",
	once: false,
	async execute(message) {
		if (message.author.bot || message.webhookID) return;
		const prefix = "entity ";
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		// Counting
		const counting = await Counting.findOne({ where: { channel: message.channel.id } });
		if (counting) {
			// Get current number
			const number = counting.number;
			// Get number from message
			const inputNumber = parseInt(message.content, 10);
			// If number is correct
			if (inputNumber === number + 1) {
				counting.increment("number", { by: 1 });
				message.react("✅");
			} else if (!isNaN(inputNumber)) {
				message.react("❌");
			}
		}
		if (!message.content.startsWith(prefix)) return;

		// Eval
		if (commandName === "eval") {
			if (message.author.id != "728910425780912199") return;
			const client = { ...message.client };
			client.token = "[REDACTED]";
			let evalArgs = message.content.split(" ");
			evalArgs.shift();
			evalArgs.shift();
			evalArgs = evalArgs.join(" ");
			let result;
			let lang = "javascript";

			try {
				result = eval(evalArgs);
			}
			catch(error) {
				return message.reply(Discord.Formatters.codeBlock(error.toString())).catch(err => console.errror(err));
			}

			let resultStr;
			if (typeof result == "object") {
				lang = "json";
				resultStr = JSON.stringify(result, null, 4);
			} else if (!result) {
				resultStr = `${result}`;
			} else {
				resultStr = result.toString();
			}

			const resultArr = resultStr ? Discord.Util.splitMessage(resultStr, { maxLength: 4050 }) : ["NO OUTPUT"];
			const inputEmbed = new Discord.MessageEmbed()
				.setTitle("Input")
				.setDescription(Discord.Formatters.codeBlock(lang, evalArgs))
				.addField("Output Type", typeof result);
			if (!resultArr[1]) {
				resultStr = Discord.Formatters.codeBlock(lang, resultStr);

				const output = new Discord.MessageEmbed()
					.setTitle("Output")
					.setDescription(resultStr);

				return message.channel.send({ embeds: [inputEmbed, output] }).catch(err => message.channel.send(Discord.Formatters.codeBlock(err.toString())));
			} else {
				const embeds = [];
				for (const element of resultArr) {
					embeds.push(
						new Discord.MessageEmbed()
							.setDescription(Discord.Formatters.codeBlock(lang, element))
					);
				}
				embeds[0].setTitle("Output");
				const first = embeds.shift();
				message.channel.send({ embeds: [inputEmbed, first] })
					.catch(err =>
						message.reply(Discord.Formatters.codeBlock(err.toString()))
					);
				embeds.forEach((element) => message.channel.send({ embeds: [element] }));
			}
		} else if (commandName === "google") {
			const searchQuery = args.join("%20");
			message.reply(`https://google.com/search?q=${searchQuery}`);
		}
	},
};