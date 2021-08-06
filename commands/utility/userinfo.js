const Discord = require('discord.js')
module.exports = {
	name: 'userinfo',
	aliases: ['user', 'whois'],
	description: 'Gives info about a user, or yourself is no one is mentioned',
	usage: '[user]',
	args: false,
	cooldown: 3,
	guildOnly: true,
	botPermissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
	async execute(message, args) {
		let user;
		let guildMember;
		if (args.length) {
			user = message.mentions.users.first() || await message.client.users.fetch(args[0]) || message.author;
			guildMember = message.mentions.members.first() || await message.guild.members.fetch(args[0]) || message.member;
		} else {
			user = message.author;
			guildMember = message.member;
		}

		let perms = Array.from(guildMember.permissions).sort();
		for (var i = perms.length; i--;){
			perms[i] = '\`' + perms[i] + '\`';
		}
		let permissions = perms.join(', ');

		let	roles = guildMember.roles.cache.map(role => role.id);
		roles.pop();
		let rolesMention = roles.map(i => '<@&' + i + '>').join(', ');
		const userEmbed = new Discord.MessageEmbed()
			.setColor(guildMember.displayHexColor)
			.setTitle(user.tag)
			.setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true}))
			.addFields(
				{ name: 'Registered', value: `<t:${Math.floor(user.createdTimestamp/1000)}:R>`},
				{ name: 'Joined', value: `<t:${Math.floor(guildMember.joinedTimestamp/1000)}:R>`},
				{ name: 'Mention', value: guildMember.toString(), inline: true},
				{ name: 'Display Colour(Hex)', value: guildMember.displayHexColor, inline: true},
				{ name: `Roles (${roles.length})`, value: rolesMention},
				{ name: 'Permissions', value: permissions},
			)
			.setTimestamp()
			.setFooter(`User ID: ${user.id}`)

		let acknowledgements = [];
		if (guildMember.premiumSince) {
			acknowledgements.push(`Boosting server since <t:${Math.floor(guildMember.premiumSinceTimestamp/1000)}:R>`)
		}
		if (acknowledgements.length) userEmbed.addField('Acknowledgements', acknowledgements.join(', '))
		message.reply({ embeds: [userEmbed] });
	},
};