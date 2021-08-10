const Discord = require('discord.js');
const { userWhitelist, guildWhitelist } = require('../config.json');
const {	Counting } = require('../database/dbIndex.js');
const { getPrefix } = require('../index.js').Util;
module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message, client) {
		if (message.author.bot || message.webhookID) return;

		const prefix = await getPrefix(message.guild.id);
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		try {
			if (message.guild && guildWhitelist.includes(message.guild.id)) {
				//Counting
				if (message.channel.id == '851989863787790357') {
					const counting = await Counting.findOne({ where: { channel: message.channel.id } });
					const number = counting.number;
					const inputNumber = parseInt(message.content);
					if ((number + 1) % 1000 == 0) message.pin();
					if (inputNumber == number + 1) {
						counting.increment('number', { by: 1 });
						message.react('✅');
					} else if (!isNaN(inputNumber)) {
						message.react('❌');
					}
				}
			}
		//https://discord.com/api/webhooks/853497855138725928/70JBp5O3LESlqXdIgjwQw8DAiciPBqGO8EtkvQiO8R85FwuLO-HEXxUMXjDjbYGqRWCv
		} catch(error) {
			console.error(error);
		}

		if (!message.content.startsWith(prefix)) return;

		//Get commands or command aliases
		const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;

		//Notify user if the command is guild only and is used in a dm
		if (command.guildOnly && message.channel.type === 'dm') {
			return message.reply('This command can only be used in a server.');
		}

		//Notify user if bot does not have sufficient permission(s) to execute the command
		if (command.botPermissions) {
			const botPerms = message.channel.permissionsFor(client.user);
			const missingPerms = [];
			command.botPermissions.forEach((element) => {
				if (!botPerms.has(element)) {
					missingPerms.push('`' + element + '`');
				}
			});
			if (missingPerms.length) {
				if (missingPerms.includes('SEND_MESAGES')) {
					let logMsg = `Insufficient permissions in ${message.channel.name} (${message.channel.id}) of ${message.guild.name}.`;
					if (botPerms.includes('ADD_REACTIONS')) {
						message.react('❌');
					}
					try {
						message.author.send(`I don't have the permission to send messages in \`#${message.channel.name}\` of \`${message.guild.name}\`.`);
					} catch (e) {
						console.log(logMsg += 'Unable to DM author too.');
					}
					return;
				}
				let msg = `I don't have sufficient permissions to execute the command \`${commandName}\`. `;
				let lastPerm;
				if (missingPerms.length > 1) {
					lastPerm = missingPerms.pop();
					msg += `I still need the permissions ${missingPerms.join(', ')} and ${lastPerm}.`;
				} else {
					msg += `I still need the permission ${missingPerms.join(', ')}.`;
				}
				return message.reply(msg);
			}
		}

		//Notify user if they do not have the required permission(s) to use the command
		if (command.userPermissions) {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (!userWhitelist.includes(message.author.id)) {
				if (!authorPerms || !authorPerms.includes(command.userPermissions)) {
					return message.reply(`You need the permissions ${command.userPermissions.join(' ')} to use this command.`);
				}
			}
		}

		//Notify user if command requires arguments and user does not provide them
		if (command.args && !args.length) {
			let reply = 'Please provide the required arguments.';
			if (command.usage) {
				reply += `\nThe proper usage of this command is \`${prefix}${command.name} ${command.usage}\`.`;
			}
			return message.reply(reply);
		}

		//Command cooldowns
		const { cooldowns } = client;
		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}
		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 1) * 1000;
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
			}
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		try {
			command.execute(message, args);
		} catch (error) {
			console.error(error);
			message.reply('An error occured while trying to execute that command.');
		}
	},
};