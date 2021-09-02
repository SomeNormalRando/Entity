const Discord = require("discord.js");
module.exports = {
	name: "Show avatar",
	execute(interaction, guildMember) {
		const user = guildMember.user;
		const embed = new Discord.MessageEmbed()
			.setColor("#2F3136")
			.setAuthor(user.tag, user.displayAvatarURL({ format: "png", dynamic: true }))
			.setTitle("Avatar")
			.setImage(user.displayAvatarURL({ format: "png", dynamic: true }) + "?size=1024");
		interaction.reply({ embeds: [embed] });
	}
};