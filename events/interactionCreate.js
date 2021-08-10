const Discord = require('discord.js');
const { Util } = require('../index.js');
module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		if (!interaction.isCommand()) return;

		if (!client.slashCommands.has(interaction.commandName)) return;

		const command = await client.slashCommands.get(interaction.commandName);

		if (command.guildOnly === true && interaction.channel.type === 'dm') return interaction.reply('This command can only be used in a server.');

		if (command.userPerms) {
			const userPerms = interaction.channel.permissionsFor(interaction.member);
			const missingPerms = [];
			command.userPerms.forEach((element) => {
				if (!userPerms.has(command.userPerms)) missingPerms.push(Discord.Formatters.inlineCode(Util.normalizeStr(element)));
			});
			if (missingPerms.length) return interaction.reply({ content: `You still need the permission(s) ${missingPerms.join(' ')} to use this command.`, ephemeral: true });
		}

		const args = {};
		if (command.options) {
			command.options.forEach(function getArgs(element) {
				const type = element.type;
				let optionVal = interaction.options.get(element.name);
				if (!optionVal) return;
				if (type == 'USER') {
					optionVal = interaction.options.getMember(element.name);
				}
				else {
					optionVal = optionVal.value;
				}
				args[element.name] = optionVal;
			});
			const subcommand = interaction.options.getSubcommand(false);
			if (subcommand) args.subcommand = subcommand;
		}
		try {
			await command.execute(interaction, args);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'An error occured while executing that command.', ephemeral: true }).catch(err => {
				console.error(err);
				interaction.followUp({ content: 'An error occured while executing that command.', ephemeral: true }).catch(err => console.error(err));
			});
		}
	},
};