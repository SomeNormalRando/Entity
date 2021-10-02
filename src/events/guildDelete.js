"use strict";
const Discord = require("discord.js");
const { guildInfo } = require("../commands/utility/serverinfo.js");
const { env } = require("../index.js");
module.exports = {
	name: "guildDelete",
	once: false,
	execute(guild, client) {
		guildInfo(guild).then(embed => {
			client.channels.cache.get(env.LOG_CHANNEL).send({
				content: Discord.Formatters.bold("EVENT `guildDelete` EMITTED"),
				embeds: [embed]
			});
		});
	},
};
