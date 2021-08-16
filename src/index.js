// Require Discord.js
const Discord = require("discord.js");

// Load token from .env into process
require("dotenv").config({ path: "../.env" });

// Create a new Discord client
const client = new Discord.Client({
	// Intents
	intents: ["GUILDS", "GUILD_MESSAGES"],
	// Status
	presence: { activities: [{ name: "Existence make me", type: "WATCHING" }] },
	// Allowed mentions
	allowedMentions: { repliedUser: false }
});

// Exports
module.exports = {
	client,
	token: process.env.TOKEN,
	config: require("./config.json"),
	Util: require("./assets/Util.js"),
};
