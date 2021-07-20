module.exports = {
	name: 'evaluate',
	aliases: ['eval', 'run'],
	description: 'Eval command',
	usage: '',
	args: false,
	cooldown: 0,
	guildOnly: false,
	hidden: true,
	execute(message, args) {
		if (message.author.id != '728910425780912199') return
		message.channel.send(eval(args.join(" ")) || `Evaluated ${args.join(" ")}`)
		console.log(`Evaluated "${args.join(" ")}" at ${new Date(Date.now())}`);
	},
};