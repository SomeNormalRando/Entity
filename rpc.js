const DiscordRPC = require('discord-rpc'); 
const client = new DiscordRPC.Client({ transport: 'ipc'}); 

let date = new Date(Date.now());
let day = date.getDate();
let dayName = date.toLocaleString('default', { weekday: 'short' });
let month = date.toLocaleString('default', { month: 'long' });
let year = date.getFullYear();

client.on('ready', async () => {
	await client.setActivity({
		details: `Decade 2: ${dayName}, ${day} ${month} ${year}`,
		buttons: [
			{ label: "Join", url: "https://discord.gg/WDuHdwwef5"}, 
			{ label: "Spectate", url: "https://bit.ly/3zWhrHj" }],
		largeImageKey: "earth",
		largeImageText: "Life",
		//smallImageKey: 'blueorb',
		//smallImageText: 'test',			
	}).catch(err => console.log(err));

	console.log("Rich Presence activated.");
});
client.login({ clientId: '860450137368035368' }).catch(console.error);