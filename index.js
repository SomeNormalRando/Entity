//Require modules
const Discord = require('discord.js');
const Sequelize = require('sequelize')
const fs = require('fs');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config()

//Create a new Discord client
const client = new Discord.Client( { disableMentions: 'everyone'} );

//Global variables
const { prefix, userWhitelist, guildWhitelist} = require('./config.json');
const countingNumberFile = require('./countingNumber.json');
client.cooldowns = new Discord.Collection();
let countingNumber = parseInt(JSON.parse(countingNumberFile.number), 10);


//Get command files
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		command.category = folder;
		client.commands.set(command.name, command);
	}
}

//Get event files
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

//Executes when a message is sent
client.on('message', async message => {
	if (message.author.bot || message.webhookID) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	try {
		if (message.guild && guildWhitelist.includes(message.guild.id)) {
			if (message.channel.id == '851989863787790357' && !message.author.bot) { //Counting
				let inputNumber = parseInt(message.content, 10);
				if (inputNumber == countingNumber + 1) {
					countingNumber += 1;
					message.react('✅');
					fs.writeFile('./countingNumber.json', `{"number": ${inputNumber}}`, 'utf8', 
					function (err) {
						if (err) {
							console.log("Error");
							return console.log(err);
						}
					})
					let modulus = countingNumber % 1000;
					if (modulus == 0) {message.pin()}
				} else if(!isNaN(inputNumber)){
					message.react('❌');
				}
			}
		}
		if (!message.content.startsWith(prefix)) return;
	//https://discord.com/api/webhooks/853497855138725928/70JBp5O3LESlqXdIgjwQw8DAiciPBqGO8EtkvQiO8R85FwuLO-HEXxUMXjDjbYGqRWCv
	} catch(error) {
		console.error(error);
	}
	
	//Get commands or command aliases
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	//Notify user if the command is guild only and is used in a dm
	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('This command can only be used in a server.');
	}

	//Notify user if they do not have the required permission(s) to use the command
	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!userWhitelist.includes(message.author.id)){
			if (!authorPerms || !authorPerms.has(command.permissions)) {
	    		return message.reply('You do not have the required permission(s) to use this command.');
			}
		}
	}

	//Notify user if command requires arguments and user does not provide them
	if (command.args && !args.length) {
		let reply = `Please provide the required arguments.`;
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
	const cooldownAmount = (command.cooldown || 3) * 1000;
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
});

//Login
client.login(process.env.TOKEN);

//Functions
const getUserfromMention = function(mention) {
	const matches = mention.match(/^<@!?(\d+)>$/);

	if (!matches) return;

	const id = matches[1];

	return client.users.cache.get(id);
}