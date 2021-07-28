const Discord = require("discord.js");
module.exports = {
	name: 'evaluate',
	aliases: ['eval', 'run'],
	description: 'Eval command',
	usage: '',
	args: false,
	cooldown: 1,
	guildOnly: false,
	hidden: true,
	execute(message) {
		if (message.author.id != '728910425780912199') return
		let args = message.content.split(' ');
		args.shift();
		args = args.join(' ')
		let result;

		try {
			result = eval(args);
		}
		catch(error) {
			return message.channel.send('```' + error.toString() + '```');
		}
		if (!result) return message.channel.send('No output');

		let resultStr;
		if (typeof result == 'object') resultStr = '```javascript\n' + JSON.stringify(result, null, 4) + '```';
		else resultStr = '```javascript\n' + result.toString() + '```';

		const embed = new Discord.MessageEmbed()
		.addFields(
			{ name: `Input`, value: '```javascript\n' + args + '```' },
			{ name: `Output`, value: resultStr },
			{ name: 'Output Type', value: typeof result }
		)
		message.channel.send(embed)
	},
};