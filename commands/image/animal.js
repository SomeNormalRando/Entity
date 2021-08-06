const Discord = require('discord.js');
const randomCat = require('random-cat');
module.exports = {
	name: 'animal',
	description: 'Get images of random animals of random sizes! Images from https://lorempixel.com.',
    aliases: ['animals'],
    usage: '',
    cooldown: 3,
	async execute(message, args) {
        const url = randomCat.get({category: 'animals'})
        const embed = new Discord.MessageEmbed()
            .setColor('#2F3136')
            .setImage(url)
            .setFooter(`Requested by ${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
            .setTimestamp()
        message.channel.send({ embeds: [embed] });
		
	},
};