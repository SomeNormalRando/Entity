module.exports = {
	name: "kill",
	aliases: ["murder"],
	description: "Kill someone",
	usage: "<user>",
	args: false,
	cooldown: 2.5,
	guildOnly: false,
	execute(message, args) {
		if (!args.length) {
			message.channel.send("You killed yourself.");
		} else {
			const killed = [
				`${args[0]} was brutally murdered by Wumpus" farts.`,
				`${args[0]} died from Pik-aaaachooooo! disease.`,
				`${args[0]} died from an overload of cute cat videos.`,
				`${args[0]} died from forgetting to breathe.`,
				`${message.author} killed ${args[0]} by the power of dank memes.`,
				`${args[0]} lost in lightsaber duel to Darth Vader.`,
				`${args[0]} was hit in the head by Thor's hammer.`,
				`${args[0]} ate a poisonous snail.`,
				`${args[0]} got shot by ${message.author}'s gun.`,
				`${args[0]} was killed by Elmo's furriness.`,
				`${args[0]} died from fanning too much over Kpop.`,
				`${args[0]} fell to the ground and died.`,
			];
			message.reply(killed[Math.floor(Math.random() * killed.length)]);
		}
	},
};