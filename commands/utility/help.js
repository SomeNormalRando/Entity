const Discord = require('discord.js');
const { getPrefix } = require('../../index.js').Util;
module.exports = {
	name: 'help',
	aliases: ['commands', 'command', 'cmd', 'cmds', 'info'],
	description: 'List all of my commands or info about a specific command.',
	usage: '[command name]',
	args: false,
	cooldown: 3,
	guildOnly: false,
	botPermissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
	async execute(message, args) {
		let { commands } = message.client;
		const prefix = await getPrefix(message.guild.id);

		commands = commands.filter(cmd => !cmd.hidden || (cmd.hidden && cmd.hidden != true));

		//List all commands if no arguments were provided
		if (!args.length) {
			const categories = new Discord.Collection();
			commands.forEach(command => {
				const category = categories.get(command.category);
				if (category) {
					category.set(command.name, command);
				} else {
					categories.set(command.category, new Discord.Collection().set(command.name, command));
				}
			});
			const helpEmbed = new Discord.MessageEmbed()
				.setColor('#2f3136')
				.setTitle('Commands')
				.setDescription(`\`${prefix}help <command>\` for more info on a specific command. \nThis bot is still in development, some things might not work as expected.`)
				.setFooter(message.client.user.tag, message.client.user.displayAvatarURL({ format: "png", dynamic: true }))
				.setTimestamp();

			categories.forEach((categoryCommands, categoryName) => {
				const category = categoryName.split('');
				category[0] = category[0].toUpperCase();
				helpEmbed.addField(category.join(''), categoryCommands.map(cmd => `\`${cmd.name}\``).join(' '));
			});
			helpEmbed.addField('Command Syntax Guide', 'Values in angle brackets (`< >`) are required. Values in square brackets (`[ ]`) are optional. The `|` sign means \'or\'.');
			message.reply({ embeds: [helpEmbed] });

		//Else try to get the command
		} else {
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command || (command.hidden && command.hidden == true)) {
				return message.reply(`Command \`${name}\` not found.`);
			}

			const helpEmbed = new Discord.MessageEmbed()
				.setColor('#2f3136')
				.setTitle(prefix + command.name)
				.setFooter(message.client.user.tag, message.client.user.displayAvatarURL({ format: "png", dynamic: true }))
				.setTimestamp();

			//Description
			if (command.description) helpEmbed.addField('Description:', command.description);

			//Usage
			if (command.usage) {
				helpEmbed.addField('Usage:', `\`${prefix}${command.name} ${command.usage}\``);
			} else {helpEmbed.addField('Usage:', `\`${prefix}${command.name}\``);}

			//Aliases
			if (command.aliases && command.aliases.length) {
				const aliases = command.aliases;
				for (let i = aliases.length; i--;) {
					aliases[i] = '`' + aliases[i] + '`';
				}
				helpEmbed.addField('Aliases:', aliases.join(', '));
			}

			//Category
			if (command.category && command.category.length) {
				const category = command.category.split('');
				category[0] = category[0].toUpperCase();
				helpEmbed.addField('Category', category.join(''));
			}
			//Cooldown
			if (command.cooldown) helpEmbed.addField('Cooldown:', `${command.cooldown} seconds`);

			//User permissions
			if (command.userPermissions) {
				const userPerms = [];
				command.userPermissions.forEach(element => {
					userPerms.push('`' + element + '`');
				});
				helpEmbed.addField('Required User Permissions:', userPerms.join(', '));
			}

			//Bot permissions
			if (command.botPermissions) {
				helpEmbed.addField('Required Bot Permissions:', command.botPermissions.join(', '));
			}

			message.reply({ embeds: [helpEmbed] });
		}
	},
};