"use strict";
const { config: { INVITE_LINK }, env: { OWNERS }, Util: { discordEval } } = require("../index.js");
module.exports = {
	name: "messageCreate",
	once: false,
	execute(message) {
		if (message.author.bot || message.webhookID) return;

		if (new RegExp(`^<@!?${message.client.user.id}>`).test(message.content)) {
			return message.reply(
				"**Message commands have been removed because of Discord removing access to message content in the future.** **__Please use slash commands instead.__**\n\n" +
				"For more info on slash commands, please visit <https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ>.\n\n" +
				`(If slash commands don't appear, try re-inviting the bot with this link: ${INVITE_LINK})`
			);
		}

		// Eval
		if (message.content.startsWith("%eval") && OWNERS.includes(message.author.id)) {
			discordEval(message, message.client);
		}
	},
};
