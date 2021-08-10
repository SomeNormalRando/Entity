const Discord = require('discord.js')
module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp', 'av', 'profilepicture', 'profilepic'],
	description: "Displays a user's avatar, or yours if no one is mentioned.",
	usage: '[user]',
	args: false,
	cooldown: 5,
	guildOnly: false,
	botPermissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
	async execute(message, args) {
		let user;
		if (args.length) {
			user = message.mentions.users.first() || await message.client.users.fetch(args[0]) || message.author;
		} else {
			user = message.author
		}

		const avatarEmbed = new Discord.MessageEmbed()
			.setColor('#2f3136')
			.setAuthor(user.tag, user.displayAvatarURL({format: "png", dynamic: true}))
			.setTitle(`Avatar`)
			.setImage(user.displayAvatarURL({format: "png", dynamic: true}) + '?size=1024')
		message.channel.send({ embeds: [avatarEmbed] });
	},
};