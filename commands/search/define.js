const querystring = require('querystring');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
module.exports = {
	name: 'define',
	aliases: ['urban', 'urbandictionary', 'dictionary'],
	description: 'Search Urban Dictionary for stuff! ',
	usage: '<query>',
	args: true,
	cooldown: 5,
	guildOnly: false,
	async execute(message, args) {
		const embed = new Discord.MessageEmbed()
			.setColor('#2F3136')
			.setTimestamp()
			.setFooter(`Requested by ${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
		let msg = await message.channel.send('Fetching results...');
		const query = querystring.stringify({ term: args.join(" ")});

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`)
			.then(response => response.json())
			.catch(error => console.error(error))

		if (!list || !list.length) {
			embed.addField(`No results found for "${args.join(" ")}"`, `[Try searching for it](https://www.urbandictionary.com/define.php?${query})`)
			return message.channel.send(embed);
		}
		
		const [answer] = list;

		embed
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addFields(
				{ name: 'Definition', value: trim(answer.definition, 1024) },
				{ name: 'Example', value: trim(answer.example, 1024) },
				{ name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.` },
				{ name: 'Written On', value: trim(answer.written_on.substring(0, 10), 1024)},
			)
		message.channel.send(embed).then(msg.delete());
	},
};