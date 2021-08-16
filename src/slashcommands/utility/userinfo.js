const Discord = require('discord.js');
const { Util } = require('../../index.js');
module.exports = {
	data: {
		name: 'userinfo',
		description: 'Gives info for a user.',
		options: [{
			name: 'user',
			type: 'USER',
			description: 'The user to show info about',
			required: false,
		}]
	},
	guildOnly: true,
	async execute(interaction, args) {
		//Define user and guildMember variables for convenience
		let user, guildMember;
		if (args.user) {
			guildMember = args.user;
			user = guildMember.user;
		} else {
			guildMember = interaction.member;
			user = guildMember.user;
		}

		//Permissions
		let permissions = Array.from(guildMember.permissions).sort();
		permissions.forEach((element, index) => {
			permissions[index] = Util.normalizeStr(element);
		});
		permissions = permissions.join(', ');

		//Roles
		const roles = guildMember.roles.cache.map(role => role.id);
		roles.pop();
		const roleText = roles.map(i => '<@&' + i + '>').join(', ');

		//Construct embed
		const embed = new Discord.MessageEmbed()
			.setColor(guildMember.displayHexColor)
			.setTitle(user.tag)
			.setThumbnail(user.displayAvatarURL({ format: 'png', dynamic: true }))
			.addFields(
				{ name: 'Registered', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>` },
				{ name: 'Joined', value: `<t:${Math.floor(guildMember.joinedTimestamp / 1000)}:R>` },
				{ name: 'Mention', value: guildMember.toString(), inline: true },
				{ name: 'Display Colour(Hex)', value: guildMember.displayHexColor, inline: true },
				{ name: `Roles (${roles.length})`, value: roleText },
				{ name: 'Permissions', value: permissions },
			)
			.setTimestamp()
			.setFooter(`User ID: ${user.id}`);

		//Ackowledgements (extra variable info to add)
		const acknowledgements = [];

		if (user.id == '728910425780912199') acknowledgements.push(`Owner of ${interaction.client.user.username}`);
		if (interaction.guild.ownerId == user.id) {
			acknowledgements.push('Server Owner');
		}
		if (guildMember.premiumSince) {
			acknowledgements.push(`Boosting server since <t:${Math.floor(guildMember.premiumSinceTimestamp / 1000)}:R>`);
		}

		if (acknowledgements.length) embed.addField('Acknowledgements', acknowledgements.join(', '));

		interaction.reply({ embeds: [embed] });
	},
};