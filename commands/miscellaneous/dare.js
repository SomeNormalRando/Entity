const dares = require('../../assets/data.json').dares;
module.exports = {
	name: 'dare',
	aliases: ['d'],
	description: 'Asks a truth question.',
	usage: '',
	args: false,
	cooldown: 5,
	guildOnly: false,
	execute(message, args) {
		message.reply('**Dare: **\n' + dares[Math.floor(Math.random() * dares.length)]);
	},
};