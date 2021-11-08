"use strict";
const { avatar } = require("../utility/avatar");
module.exports = {
	data: {
		name: "Avatar",
		type: "USER"
	},
	execute(interaction, guildMember) {
		const embed = avatar(guildMember.user);
		interaction.reply({ embeds: [embed] });
	}
};
