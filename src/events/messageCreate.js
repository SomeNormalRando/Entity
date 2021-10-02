"use strict";
const Discord = require("discord.js");

const { Counting } = require("../database/dbIndex.js");
const { config, env } = require("../index.js");
module.exports = {
	name: "messageCreate",
	once: false,
	// eslint-disable-next-line no-unused-vars
	async execute(message, client) {
		if (message.author.bot || message.webhookID) return;
		// Counting
		if (message.channel.id === "851989863787790357") {
			const counting = await Counting.findOne({ where: { channel: message.channel.id } });
			if (counting) {
				// Get current number
				const { number } = counting;
				// Get number from message
				const inputNumber = parseInt(message.content, 10);
				// If number is correct
				if (inputNumber === number + 1) {
					counting.increment("number", { by: 1 });
					message.react("✅");
				} else if (!isNaN(inputNumber)) message.react("❌");
			}
		}

		// Message commands
		const mention = `<@!${message.client.user.id}>`;
		let prefix = "%";
		if (message.content.toLowerCase().match(/^entity\s/)) prefix = "entity ";

		const args = message.content.slice(prefix?.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		/* eslint-disable-next-line curly */
		if (commandName === mention) {
			message.reply(`Message commands have been removed, use slash commands instead.
			https://imgur.com/KS2M6dC
			If slash commands don't appear, try reinviting the bot with this link:
			${config.inviteLink}`);
		}

		// Owners-only commands
		if (!env.OWNERS.includes(message.author.id)) return;
		try {
			switch (commandName) {
				// Eval
				case "eval": {
					let evalArgs = message.content.substring(prefix.length + commandName.length + 1).split(" ");

					// Flags
					let sendWithoutEmbed = false;
					if (["--dont-send", "--no-send", "-ns", "ds", "-s"].includes(evalArgs[0])) {
						sendWithoutEmbed = true;
						evalArgs.shift();
					}
					if (["--run-async", "--async", "-a"].includes(evalArgs[0])) {
						evalArgs.shift();
						evalArgs = `(async function eval() {\n${evalArgs.join(" ")}\n})()`.split(" ");
					}

					evalArgs = evalArgs.join(" ");

					let result;
					let lang = "javascript";

					try {
						/* eslint-disable-next-line no-eval */
						result = eval(evalArgs);
					} catch (error) {
						return message.reply(Discord.Formatters.codeBlock(error.toString())).catch(err => console.errror(err));
					}
					if (sendWithoutEmbed === true) return;
					let resultStr;
					if (typeof result === "object") {
						lang = "json";
						resultStr = JSON.stringify(result, null, 4);
					} else {
						resultStr = `${result}`;
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

						message.channel.send({ embeds: [inputEmbed, output] })
							.catch(err => message.channel.send(Discord.Formatters.codeBlock(err.toString())));
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
							.catch(err => message.reply(Discord.Formatters.codeBlock(err.toString())));
						for (const element of embeds) message.channel.send({ embeds: [element] });
					}
					break;
				}
				// Google
				case "google": {
					const searchQuery = encodeURIComponent(args.join(" "));
					message.reply(`https://google.com/search?q=${searchQuery}`);
					break;
				}
				default: return;
			}
		} catch (err) {
			console.error(err);
			message.reply(err.toString());
		}
	},
};
