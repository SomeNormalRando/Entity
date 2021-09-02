module.exports = {
	data: {
		name: "kill",
		description: "(Fake) kill someone",
		options: [{
			name: "user",
			type: "USER",
			description: "The user to kill",
		}]
	},
	execute(interaction, args) {
		const data = [
			"${user} fell to the ground and died.",
			"${user} died from an overload of cute cat videos.",
			"${author} killed ${user} with a grain of sand.",
			"${user} forgot to breathe and died.",
			"${user} died of dehydration.",
			"${author} KOed ${user} with a kick.",
			"${author} tried to kill ${user} with a gun but shot themself instead.",
			"${author} wished ${user} out of existence.",
			"${user} never woke up from their sleep."
		];
		if (!args.user) {
			interaction.reply("You killed yourself.");
		}
		else {
			interaction.reply(
				data[Math.floor(Math.random() * data.length)]
					.replace("${user}", args.user.user.username)
					.replace("${author}", interaction.member.toString())
			);
		}
	},
};