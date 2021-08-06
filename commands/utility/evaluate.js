const Discord = require("discord.js");
const fetch = require('node-fetch');
module.exports = {
	name: 'evaluate',
	aliases: ['eval', 'run'],
	description: 'Eval command',
	usage: '<code>',
	args: true,
	cooldown: 1,
	guildOnly: false,
	hidden: true,
	execute(message) {
		if (message.author.id != '728910425780912199') return message.reply('<:BlobNo:847720056380850216>');
		const client = message.client;
		let args = message.content.split(' ');
		args.shift();
		args = args.join(' ');
		
		let result;
		let lang = 'javascript';

		try {
			result = eval(args);
		}
		catch(error) {
			return message.reply(Discord.Formatters.codeBlock(error.toString())).catch(err => console.errror(err));
		}
		if (!result) return message.reply('No output');

		let resultStr;
		if (typeof result == 'object') {
			lang = 'json';
			resultStr = JSON.stringify(result, null, 4);
		}
		else resultStr = result.toString();

		let resultArr = Discord.Util.splitMessage(resultStr, { maxLength: 4050 });
		let inputEmbed = new Discord.MessageEmbed()
			.setTitle('Input')
			.setDescription(Discord.Formatters.codeBlock(lang, args))
			.addField('Output Type', typeof result)
		if (!resultArr[1]) {
			resultStr = Discord.Formatters.codeBlock(lang, resultStr)

			let output = new Discord.MessageEmbed()
				.setTitle('Output')
				.setDescription(resultStr)
			
			return message.channel.send({ embeds: [inputEmbed, output] }).catch(err => message.channel.send(Discord.Formatters.codeBlock(err.toString())))
		} else {
			let embeds = [];
			for (const element of resultArr) {
				embeds.push(
					new Discord.MessageEmbed()
					.setDescription(Discord.Formatters.codeBlock(lang, element))
				)
			}
			embeds[0].setTitle('Output');
			const first = embeds.shift();
			message.channel.send({ embeds: [inputEmbed, first] })
				.catch(err => 
					message.reply(Discord.Formatters.codeBlock(err.toString()))
				)
			embeds.forEach((element) => message.channel.send({ embeds: [element] }))
		}
	},
};