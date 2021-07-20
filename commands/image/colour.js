const Discord = require('discord.js');
const Canvas = require('canvas');
module.exports = {
	name: 'colour',
	description: 'Visualize any colour, or generate a random one if nothing is provided. Accepts RGB, RGBA, HSL, HSLA, HEX, and CSS colour names.',
    aliases: ['color'],
    usage: '<color>',
    args: false,
    cooldown: 3,
    guildOnly: false, 
	async execute(message, args) {
        function randomColour() {
            function num() {
                return Math.floor(Math.random() * 256);
            }
            return `rgb(${num()}, ${num()}, ${num()})`;
        }
        function hexToRGB(h) {
            let r = 0, g = 0, b = 0;
            // 3 digits
            if (h.length == 4) {
              r = "0x" + h[1] + h[1];
              g = "0x" + h[2] + h[2];
              b = "0x" + h[3] + h[3];
            // 6 digits
            } else if (h.length == 7) {
              r = "0x" + h[1] + h[2];
              g = "0x" + h[3] + h[4];
              b = "0x" + h[5] + h[6];
            }
            return "rgb("+ +r + ", " + +g + ", " + +b + ")";
          }
        let colour;
        args.length ? colour = args.join(" ") : colour = randomColour()
        let msg = await message.channel.send('<a:Loading:862547071844089866>')

        const canvas = Canvas.createCanvas(250, 250);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = colour;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), ctx.fillStyle + ".png")
        const embed = new Discord.MessageEmbed()
            .setTitle('Colour')
            .setColor(ctx.fillStyle)
            .attachFiles({attachment: canvas.toBuffer('image/png'), name: 'a.png'})
            .setThumbnail('attachment://a.png')
            .addFields(
                { name: 'Hex', value: ctx.fillStyle},
                { name: 'RGB', value: hexToRGB(ctx.fillStyle)}
            )

        await msg.delete();
        await message.channel.send(embed)
	},
};