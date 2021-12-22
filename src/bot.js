"use strict";
process.stdout.write("Running bot.js...");
// Require needed modules
// eslint-disable-next-line id-length
const { Collection, ApplicationCommandManager } = require("discord.js");
const { readdirSync } = require("fs");
const { client, env: { TOKEN }, config: { IGNORE }, Constants: { RESET_ESCAPE_CODE }, Util: { errSep } } = require("./index");

client.commands = new Collection();
client.cooldowns = new Collection();

process.stdout.write(`${RESET_ESCAPE_CODE}Reading command files...`);
// Command handling
const commandFolders = readdirSync("./commands");
for (const folder of commandFolders) {
	if (IGNORE.folders.includes(folder)) continue;
	const commandFiles = readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		if (IGNORE.files.includes(file)) continue;
		const command = require(`./commands/${folder}/${file}`);
		command.data = ApplicationCommandManager.transformCommand(command.data);
		client.commands.set(command.data.name, command);
	}
}

process.stdout.write(`${RESET_ESCAPE_CODE}Reading event files...`);
// Event handling
const eventFiles = readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// Login
// 0 is reset, 1 is bold, 91 is brightRed
client.login(TOKEN).catch(err => console.error("\n\x1b[91mCould not login:\x1b[0m", err));

process.on("unhandledRejection", reason => {
	console.error(`${errSep}\n\x1b[1;91mUnhandled promise rejection:\x1b[0m`, reason, `\n${errSep}`);
});
