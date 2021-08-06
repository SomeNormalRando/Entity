module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		if (!interaction.isCommand()) return;

		if (!client.slashCommands.has(interaction.commandName)) return;

		const command = await client.slashCommands.get(interaction.commandName);

		if (command.guildOnly == true && interaction.channel.type === 'dm') return interaction.reply('This command can only be used in a server.');

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
			const subcommand = interaction.options.getSubcommand();
			if (subcommand) args.subcommand = subcommand;
		}
		try {
			await command.execute(interaction, args);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'An error occured while executing that command.', ephemeral: true });
		}
	},
};