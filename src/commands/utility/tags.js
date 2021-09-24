/* eslint-disable no-lonely-if */
const Discord = require('discord.js');
const { Tags } = require('../../database/dbIndex.js');
module.exports = {
	data: {
		name: 'tags',
		description: 'Manage tags. Use /tag to use a tag',
		options: [
			{
				name: 'list',
				description: 'List all tags in this server',
				type: 'SUB_COMMAND',
			},
			{
				name: 'add',
				description: 'Adds a tag',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'name',
						description: 'Name of the tag to add',
						type: 'STRING',
						required: true,
					},
					{
						name: 'content',
						description: 'Content of the tag to add',
						type: 'STRING',
						required: true,
					},
				],
			},
			{
				name: 'edit',
				description: 'Edits a tag',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'name',
						description: 'Name of the tag to edit',
						type: 'STRING',
						required: true,
					},
					{
						name: 'content',
						description: 'Content of the tag to edit',
						type: 'STRING',
						required: true,
					},
				],
			},
			{
				name: 'delete',
				description: 'Deletes a tag',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'name',
						description: 'Name of the tag to delete',
						type: 'STRING',
						required: true,
					}
				],
			},
			{
				name: 'info',
				description: 'Shows info on a tag. Use /tag to get a tag instead',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'name',
						description: 'Name of the tag to show info on',
						type: 'STRING',
						required: true,
					},
				],
			},
		]
	},
	async execute(interaction, args) {
		const subcommand = args.subcommand;
		//List all tags
		if (subcommand == 'list') {
			const tagList = await Tags.findAll({ attributes: ['name'], where: { guild: interaction.guild.id } });
			const tagString = tagList.map(t => `\`${t.name}\``).join(', ') || `No tags yet. Use \`/tags add\` to add a tag.`;
			const embed = new Discord.MessageEmbed()
				.setTitle(`Tags in ${interaction.guild.name}`)
				.setColor('#2f3136')
				.setDescription(tagString)
				.setFooter(`/tag <tag name> to use a tag`)
				.setTimestamp();
			return interaction.reply({ embeds: [embed] });
		} else {
			//If the user doesn't have the required permissions
			const permsNeeded = 'MANAGE_MESSAGES';
			if (!interaction.member.permissions.has(permsNeeded)) return interaction.reply({ content: `You need the ${permsNeeded} permission to use this command.`, ephemeral: true });

			//Define variables for the tag name and tag content for utility
			const tagName = interaction.options.getString('name');
			const tagContent = interaction.options.getString('content');

			//If the length of the tag name is too long
			if (tagName.length > 255) return interaction.reply({ content: 'Tag names cannot be longer than 255 characters.', ephemeral: true });

			//If the length of the tag content is too long
			if (tagContent?.length > 2000) return interaction.reply({ content: 'The content of a tag cannot be longer than 2000 characters, because I can\'t send it.', ephemeral: true });
			//Add tag
			if (subcommand == 'add') {
				const existingTag = await Tags.findOne({ where: { name: tagName, guild: interaction.guild.id } });
				if (existingTag) return interaction.reply(`Tag \`${tagName}\` already exists.`);
				try {
					const tag = await Tags.create({
						name: tagName,
						content: tagContent,
						createdBy: interaction.member.toString(),
						updatedBy: interaction.member.toString(),
						guild: interaction.guild.id
					});
					return interaction.reply(`Tag \`${tag.name}\` added.`);
				}
				catch (e) {
					console.log(e);
					return interaction.reply({ content: 'An error occured.', ephemeral: true });
				}
			} else if (subcommand == 'edit') {
				const affectedRows = await Tags.update({ content: tagContent, updatedBy: interaction.member.toString() }, { where: { name: tagName, guild: interaction.guild.id } });
				if (affectedRows > 0) {
					return interaction.reply(`Tag \`${tagName}\` was edited.`);
				}
				return interaction.reply({ content: `Couldn't find tag \`${tagName}\`.`, ephemeral: true });
			} else if (subcommand == 'delete') {
				const rowCount = await Tags.destroy({ where: { name: tagName, guild: interaction.guild.id } });
				if (!rowCount) return interaction.reply({ content: `Couldn't find tag \`${tagName}\`.`, ephemeral: true });
				return await interaction.reply(`Tag \`${tagName}\` deleted.`);

			//info
			} else if (subcommand == 'info') {
				const tag = await Tags.findOne({ where: { name: tagName, guild: interaction.guild.id } });
				if (!tag) return interaction.reply({ content: `Couldn't find tag \`${tagName}\``, ephemeral: true });
				const embed = new Discord.MessageEmbed()
					.setTitle(`Info for tag ${tag.name}`)
					.setColor('#2f3136')
					.addFields(
						{ name: 'Content', value: Discord.Util.escapeMarkdown(tag.content) },
						{ name: 'Created By', value: tag.createdBy, inline: true },
						{ name: 'Created', value: Discord.Formatters.time(tag.updatedAt, 'R'), inline: true },
						{ name: 'Last Updated By', value: tag.updatedBy, inline: true },
						{ name: 'Last Updated', value: Discord.Formatters.time(tag.updatedAt, 'R'), inline: true }
					)
					.setFooter(`/tag <tag name> to use a tag`)
					.setTimestamp();
				return await interaction.reply({ embeds: [embed] });
			}
		}
	}
};