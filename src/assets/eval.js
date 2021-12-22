"use strict";
const Discord = require("discord.js");
const { EMBED_COLOUR } = require("./Constants");
const evalFlags = {
	"async": ["--run-async", "--async", "-a"],
	"no-send": ["--no-send", "-ns", "-s"]
};
// eslint-disable-next-line no-unused-vars
module.exports = (message, client) => {
	let evalArgs = message.content.split(" "), lang = "javascript", result;
	evalArgs.shift();

	// Flags
	let async = true, sendEmbed = true;
	for (let i = 0, len = Object.keys(evalFlags).length; i < len; i++) {
		if (evalFlags.async.includes(evalArgs[i]) && !async) {
			evalArgs.shift();
			evalArgs = `(async function() {\n${evalArgs.join(" ")}\n})().then(r => r)`.split(" ");
			async = true;
		} else if (evalFlags["no-send"].includes(evalArgs[i]) && sendEmbed) {
			evalArgs.shift();
			sendEmbed = false;
		}
	}
	evalArgs = evalArgs.join(" ");

	try {
		// eslint-disable-next-line no-eval
		result = eval(evalArgs);
	} catch (error) {
		return message.reply(Discord.Formatters.codeBlock(error.toString())).catch(err => console.error(err));
	}
	if (sendEmbed === false) return;

	const resultStr = typeof result === "object" ? JSON.stringify(result, null, 4) : `${result}`;
	if (typeof result === "object") lang = "json";

	const resultArr = resultStr ? Discord.Util.splitMessage(resultStr, { maxLength: 4086 }) : ["NO OUTPUT"];
	const inputEmbed = new Discord.MessageEmbed()
		.setTitle("Input")
		.setColor(EMBED_COLOUR)
		.setDescription(Discord.Formatters.codeBlock(lang, evalArgs))
		.addField("Output Type", Array.isArray(result) ? "array" : typeof result);
	const first = new Discord.MessageEmbed()
		.setTitle("Output")
		.setColor(EMBED_COLOUR)
		.setDescription(Discord.Formatters.codeBlock(lang, resultStr));

	message.reply({ embeds: [inputEmbed, first] })
		.catch(err => message.reply(Discord.Formatters.codeBlock(err.toString())));

	resultArr.shift();
	for (const element of resultArr) {
		message.reply({ embeds: [
			new Discord.MessageEmbed()
				.setColor(EMBED_COLOUR)
				.setDescription(Discord.Formatters.codeBlock(lang, element))
		] }).catch(err => message.reply(Discord.Formatters.codeBlock(err.toString())));
	}
};
