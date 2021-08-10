const { Tags } = require('../../database/dbIndex.js');
const Discord = require('discord.js');
const { getPrefix } = require('../../index.js').Util;
module.exports = {
	name: 'tags',
	aliases: ['tag'],
	description: 'Custom commands',
	usage: '[add|edit|delete|info|tag name] [tag name] [tag content]',
	args: false,
	cooldown: 3,
	guildOnly: true,
	botPermissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
	async execute(message, args) {
		const prefix = await getPrefix(message.guild.id);
		const subcommand = args.shift()?.toLowerCase();
		if (!subcommand) {
			const tagList = await Tags.findAll({ attributes: ['name'], where: { guild: message.guild.id } });
			const tagString = tagList.map(t => `\`${t.name}\``).join(', ') || `No tags yet. Type \`${prefix}tag add <tag name> <tag content>\` to add a tag.`;
			const embed = new Discord.MessageEmbed()
				.setTitle(`Tags in ${message.guild.name}`)
				.setColor('#2f3136')
				.setDescription(tagString)
				.setFooter(`${prefix}tag <tag name> to use a tag`)
				.setTimestamp();
			return message.reply({ embeds: [embed] });

		} else {
			const tagName = args.shift()?.toLowerCase();
			const tagContent = args.join(' ');

			//add
			if (subcommand == 'add') {
				if (!tagName || !tagContent) return message.reply(`Please provide a tag name and tag content.`);
				const existingTag = await Tags.findOne({ where: { name: tagName, guild: message.guild.id } });
				if (existingTag) return message.reply(`Tag \`${tagName}\` already exists.`);
				try {
					const tag = await Tags.create({
						name: tagName,
						content: tagContent,
						createdBy: message.author.username,
						updatedBy: message.author.username,
						guild: message.guild.id
					});
					return message.reply(`Tag \`${tag.name}\` added.`);
				}
				catch (e) {
					console.log(e);
					return message.reply('An error occured.');
				}

			//edit
			} else if (subcommand == 'edit') {
				if (!tagName || !tagContent) return message.reply(`Please provide a tag name and tag content.`);

				const affectedRows = await Tags.update({ content: tagContent }, { where: { name: tagName, guild: message.guild.id } });
				if (affectedRows > 0) {
					return message.reply(`Tag \`${tagName}\` was edited.`);
				}
				return message.reply(`Couldn't find tag \`${tagName}\`.`);

			//delete
			} else if (subcommand == ('delete' || 'remove' || 'byebye')) {
				if (!tagName) return message.reply(`Please provide a tag to delete.`);

				const rowCount = await Tags.destroy({ where: { name: tagName, guild: message.guild.id } });
				if (!rowCount) return message.reply(`Couldn't find tag \`${tagName}\`.`);
				return message.reply(`Tag \`${tagName}\` deleted.`);

			//info
			} else if (subcommand == 'info') {
				if (!tagName) return message.reply(`Please provide a tag name.`);
				const tag = Tags.findOne({ where: { name: tagName, guild: message.guild.id } });
				const embed = new Discord.MessageEmbed()
					.setTitle(`Info for tag ${tag.name}`)
					.setColor('#2f3136')
					.addFields(
						{ name: 'Content', value: tag.content },
						{ name: 'Created By', value: tag.createdBy, inline: true },
						{ name: 'Created At', value: tag.createdAt, inline: true },
						{ name: 'Last Updated By', value: `<t:${tag.updatedBy}:R>`, inline: true },
						{ name: 'Last Updated At', value: `<t:${tag.updatedAt}:R>`, inline: true }
					)
					.setFooter(`${prefix}tag <tag name> to use a tag`)
					.setTimestamp();
				return message.reply({ embeds: [embed] });

			//find tag
			} else {
				const tag = await Tags.findOne({ where: { name: subcommand, guild: message.guild.id } });
				if (tag) {
					return message.channel.send(tag.get('content'));
				}
				return message.reply(`Couldn't find tag \`${subcommand}\`.`);
			}
		}
	},
};