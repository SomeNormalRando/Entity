const Discord = require('discord.js');
module.exports = {
	data: {
		name: 'avatar',
		description: "Get a user's avatar",
		options: [{
			name: 'user',
			type: 'USER',
			description: 'User to get the avatar',
			required: false,
		}],
	},
	async execute(interaction, args) {
		let user;
		if (!args.user) user = interaction.member.user;
		else user = args.user.user;

		const embed = new Discord.MessageEmbed()
			.setColor('#2F3136')
			.setAuthor(user.tag, user.displayAvatarURL({ format: "png", dynamic: true }))
			.setTitle(`Avatar`)
			.setImage(user.displayAvatarURL({ format: "png", dynamic: true }) + '?size=1024');
		interaction.reply({ embeds: [embed] });
	},
};