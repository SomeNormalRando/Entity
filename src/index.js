"use strict";
const config = require("./config.json");
process.stdout.write(`${config.RESET_ESCAPE_CODE}Running index.js...`);

const { Client } = require("discord.js");

// Create a new Discord client
const client = new Client({
	// Intents
	intents: ["GUILDS", "GUILD_MESSAGES"],
	// Status
	presence: { activities: [{ name: "your slash commands", type: "LISTENING" }] },
	// Allowed mentions
	allowedMentions: { parse: ["users", "roles"], repliedUser: false }
});

// Exports
module.exports = {
	client,
	config,
	env: require("./env.json"),
	Util: require("./assets/Util.js")
};
