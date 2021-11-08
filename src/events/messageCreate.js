"use strict";
const { config: { INVITE_LINK }, env, Util: { discordEval } } = require("../index.js");
module.exports = {
	name: "messageCreate",
	once: false,
	// eslint-disable-next-line no-unused-vars
	execute(message) {
		if (message.author.bot || message.webhookID) return;

		if (new RegExp(`^<@!?${message.client.user.id}>`).test(message.content)) {
			const lines = [
				"__**Message commands have been removed, use slash commands instead.**__",
				"*For more info on slash commands, visit <https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ>.*",
				`\n4(If slash commands don't appear, try re-inviting the bot with this link: ${INVITE_LINK})`,
			];
			return message.reply(lines.join("\n"));
		}

		// Eval
		if (message.content.startsWith("%eval") && env.OWNERS.includes(message.author.id)) {
			discordEval(message, message.client);
		}
	},
};
