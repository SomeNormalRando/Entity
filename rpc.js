const DiscordRPC = require('discord-rpc');
const client = new DiscordRPC.Client({ transport: 'ipc' });

const date = new Date(Date.now());
const day = date.getDate();
const dayName = date.toLocaleString('default', { weekday: 'short' });
const month = date.toLocaleString('default', { month: 'long' });
const year = date.getFullYear();

client.on('ready', async () => {
	await client.setActivity({
		details: `Decade 2: ${dayName}, ${day} ${month} ${year}`,
		buttons: [
			{ label: "Spectate", url: "https://bit.ly/3zWhrHj" }],
		largeImageKey: "earth",
		largeImageText: "Life",
		//smallImageKey: 'blueorb',
		//smallImageText: 'test',
	}).catch(err => console.log(err));

	console.log("Rich Presence activated.");
});
client.login({ clientId: '860450137368035368' }).catch(console.error);