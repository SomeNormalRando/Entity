module.exports = {
	name: 'flipcoin',
	aliases: ['flip', 'flipacoin'],
	description: 'Flips a coin.',
	usage: '',
	args: false,
	cooldown: 5,
	guildOnly: false,
	async execute(message, args,) {
		let flip = ['heads', 'tails'];
    	message.reply(`You flipped a coin and got **${flip[Math.floor(Math.random() * flip.length)]}**!`)
	},
};