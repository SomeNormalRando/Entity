const { Tags } = require('../../database/dbIndex.js');
module.exports = {
	data: {
		name: 'tag',
		description: 'Get a tag by name',
		options: [{
			name: 'tag',
			description: 'Tag to get',
			type: 'STRING',
			required: true,
		}]
	},
	async execute(interaction, args) {
		const tagName = args.tag;
		const tag = await Tags.findOne({ where: { name: tagName, guild: interaction.guild.id } });
		if (tag) {
			return interaction.reply(tag.get('content'));
		}
		return interaction.reply({
			content: `Couldn't find tag \`${tagName}\`. Use \`/tags list\` for a list of all tags.`,
			ephemeral: true
		});
	}
};