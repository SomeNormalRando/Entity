const fetch = require('node-fetch');
const Discord = require('discord.js');
const { Tags, Prefixes, Counting } = require('../dbindex.js');
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		//Set presence
		client.user.setActivity('%help', { type: 'WATCHING' });
		//Register slash commands
		const commands = [];
		for (let cmd of client.slashCommands) {
			cmd = cmd[1];
			if (cmd.options) commands.push({ name: cmd.name, description: cmd.description, options: cmd.options });
			else commands.push({ name: cmd.name, description: cmd.description });
		}
		await client.guilds.cache.get('803545644043730944').commands.set(commands)
			.then(console.log('Slash commands registered'));

		//Sync databases
		(async function() {
			Tags.sync();
			Prefixes.sync();
			Counting.sync();
		}()).then(console.log('Databases synced'));

		//Log message when everything is done
		console.log(`Bot activated, logged in as ${client.user.tag}.`);

		//Lastly start interval to post random animals
		setInterval(() => randomAnimals(client), 1800000);
	},
};
//Random animals function
async function randomAnimals(client) {
	try {
		const dogImage = await fetch('https://dog.ceo/api/breeds/image/random').then(response => response.json());
		const dogWebhook = await client.fetchWebhook('869118433105682442', 'mLa7tBZFP2pW6s4sd9NOjmkmO8siHwi2TjW2OwoZ2EwvkMR5joDZhtKU9N56LPvxCXcq');
		await dogWebhook.send(dogImage.message).catch(err => console.error(err));

		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
		const catWebhook = await client.fetchWebhook('854155515696119819', 'tjkSs0YeD0rYMgyVGEQfNyYvjtal5sbOczctEwwXDdG8uPk3WcPBfAO10U2XH0xYmcMv');
		const catWebhookClient = new Discord.WebhookClient('869111109662146580', 'Rin0NCPvR5EoWJkUJluko0wtHS1QKfi1gP25EHrRTK0Vf5TfCxjr6YgAOim4r6Z0j8Re');

		await catWebhook.send(file).catch(err => console.error(err));
		await catWebhookClient.send(file).catch(err => console.error(err));


	} catch (error) {
		console.error(error);
	}
}