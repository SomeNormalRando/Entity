const truths = require('../../assets/data.json').truths;
module.exports = {
	name: 'truth',
	aliases: ['t'],
	description: 'Asks a truth question.',
	usage: '',
	args: false,
	cooldown: 5,
	guildOnly: false,
	execute(message, args) {
		message.reply('**Truth: **\n' + truths[Math.floor(Math.random() * truths.length)]);
	},
};