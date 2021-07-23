const { Prefixes, getPrefix } = require('../../dbindex.js')
const Discord = require('discord.js')
module.exports = {
	name: 'prefix',
	aliases: [],
	description: 'Change or show the bot\'s prefix',
	usage: '[new prefix]',
	args: false,
	cooldown: 5,
	guildOnly: true,
	permissions: 'MANAGE_SERVER',
	async execute(message) {
		const currentPrefix = await getPrefix(message.guild.id);

		const args = message.content.slice(currentPrefix.length).split(' ')
		args.shift()
		const newPrefix = args.join();
		if (!args.length) {
			const embed = new Discord.MessageEmbed()
				.setTitle(`Current prefix for ${message.guild.name}`)
				.setColor('#2f3136')
				.setDescription('`' + currentPrefix + '`')
				.setFooter(`${currentPrefix}prefix <new prefix> to set a new prefix`)
				.setTimestamp()
			message.channel.send(embed)
		} else {
			const [created] = await Prefixes.findOrCreate({
				where: { guild: message.guild.id, prefix: currentPrefix }, 
				defaults: {
					guild: message.guild.id,
					prefix: newPrefix
				}
			})
			await Prefixes.update({ prefix: newPrefix }, { where: { guild: message.guild.id } })
			await message.channel.send(`Prefix changed to \`${newPrefix}\`.`)
		}
	},
};