"use strict";
const { userInfo } = require("../../commands/utility/userinfo");
module.exports = {
	name: "Show user info",
	execute(interaction, guildMember) {
		const embed = userInfo(guildMember);

		interaction.reply({ embeds: [embed] });
	}
};
