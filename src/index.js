"use strict";
const Constants = require("./assets/Constants");
process.stdout.write(`${Constants.RESET_ESCAPE_CODE}Running index.js...`);

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
	config: require("./config.json"),
	env: require("./env.json"),
	Constants,
	Util: require("./assets/Util")
};
