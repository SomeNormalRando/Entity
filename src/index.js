"use strict";
const Discord = require("discord.js");

// Create a new Discord client
const client = new Discord.Client({
	// Intents
	intents: ["GUILDS", "GUILD_MESSAGES"],
	// Status
	presence: { activities: [{ name: "Existence make me", type: "WATCHING" }] },
	// Allowed mentions
	allowedMentions: { parse: ["users", "roles"], repliedUser: false }
});

// Exports
module.exports = {
	client,
	env: require("./env.json"),
	config: require("./config.json"),
	Util: require("./assets/Util.js"),
};
