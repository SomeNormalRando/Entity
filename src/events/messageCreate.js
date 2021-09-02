"use strict";
const Discord = require("discord.js");
const {	Counting } = require("../database/dbIndex.js");
const { config } = require("../index.js");
module.exports = {
	name: "messageCreate",
	once: false,
	async execute(message) {
		if (message.author.bot || message.webhookID) return;
		// Counting
		if (message.channel.id === "851989863787790357") {
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
		}

		// Message commands
		const mention = `<@!${message.client.user.id}>`;
		let prefix;
		if (message.content.match(/^%/)) prefix = "%";
		else if (message.content.toLowerCase().match(/^entity\s/)) prefix = "entity ";
		else if (!message.content.startsWith(mention)) return;

		const args = message.content.slice(prefix?.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		if (commandName === mention) {
			message.channel.send("Message commands have been removed, use slash commands instead.\nhttps://imgur.com/KS2M6dC \nIf slash commands don't appear, try reinviting the bot with this link:\nhttps://discord.com/oauth2/authorize?client_id=812960290718482483&permissions=1007021175&scope=applications.commands%20bot");
		}

		// Owners-only commands
		if (!config.owners.includes(message.author.id)) return;
		// Eval
		if (commandName === "eval") {
			const client = { ...message.client };
			client.token = "[REDACTED]";
			let evalArgs = message.content.substring(prefix.length + commandName.length + 1);
			let sendWithoutEmbed = false;
			if (evalArgs.split(" ")[0] === "-s") {
				sendWithoutEmbed = true;
				evalArgs = evalArgs.split(" ");
				evalArgs.shift();
				evalArgs = evalArgs.join(" ");
			}
			let result;
			let lang = "javascript";

			try {
				result = eval(evalArgs);
			}
			catch(error) {
				return message.reply(Discord.Formatters.codeBlock(error.toString())).catch(err => console.errror(err));
			}
			if (sendWithoutEmbed === true) return;
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
			const searchQuery = encodeURIComponent(args.join(" "));
			message.reply(`https://google.com/search?q=${searchQuery}`);
		}
	},
};