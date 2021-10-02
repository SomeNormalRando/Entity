"use strict";
const { avatar } = require("../../commands/utility/avatar");
module.exports = {
	name: "Show avatar",
	execute(interaction, guildMember) {
		const embed = avatar(guildMember.user);
		interaction.reply({ embeds: [embed] });
	}
};
