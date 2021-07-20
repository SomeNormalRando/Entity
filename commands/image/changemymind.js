const Discord = require('discord.js');
const Canvas = require('canvas');
module.exports = {
	name: 'changemymind',
	description: 'Change my mind',
    aliases: [],
    usage: '<text>',
    args: true,
    cooldown: 3,
    guildOnly: false, 
	async execute(message, args) {
        let msg = await message.channel.send('<a:Loading:862547071844089866>')

        const applyText = (canvas, text) => {
            const context = canvas.getContext('2d');
            let fontSize = 70;
            do {
                context.font = `${fontSize -= 10}px sans-serif`;
            } while (context.measureText(text).width > canvas.width - 400);

            return context.font;
        };

        const canvas = Canvas.createCanvas(1182, 1182);
        const context = canvas.getContext('2d');
        const template = await Canvas.loadImage('./assets/changemymind.png')
        context.textAlign = 'center';

        context.drawImage(template, 0, 0, canvas.width, canvas.height);
        context.font = applyText(canvas, args.join(" "))
        context.fillStyle = '#000000';
        context.fillText(args.join(" "), canvas.width / 2, canvas.height / 1.5)

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'changemymind.png')
        await msg.delete();
        await message.channel.send(attachment)

	},
};