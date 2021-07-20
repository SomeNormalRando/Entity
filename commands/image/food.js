const Discord = require('discord.js');
const randomCat = require('random-cat');
module.exports = {
	name: 'food',
	description: 'Get images of random food of random sizes! Images from lorempixel.com.',
    aliases: ['yummy', 'edibles'],
    usage: '',
    cooldown: 3,
	async execute(message, args) {
        const url = randomCat.get({category: 'food'})
        const embed = new Discord.MessageEmbed()
            .setColor('#2F3136')
            .setImage(url)
            .setFooter(`Requested by ${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
            .setTimestamp()
        message.channel.send(embed);
		
	},
};