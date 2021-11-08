"use strict";
const { userInfo } = require("../utility/userinfo");
module.exports = {
	data: {
		name: "User info",
		type: "USER"
	},
	execute(interaction, guildMember) {
		const embed = userInfo(guildMember);
		interaction.reply({ embeds: [embed] });
	}
};
