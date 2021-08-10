const fetch = require('node-fetch');
const Discord = require('discord.js');
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		//Register slash commands
		const commands = [];
		for (let cmd of client.slashCommands) {
			cmd = cmd[1];
			const cmdObj = { name: cmd.name, description: cmd.description };
			//Options
			if (cmd.options) cmdObj['options'] = cmd.options;
			//Permissions
			if (cmd.permissions) cmdObj['permissions'] = cmd.permissions;
			commands.push(cmdObj);
		}
		await client.guilds.cache.get('803545644043730944').commands.set(commands);
		await client.guilds.cache.get('796828550010241114').commands.set(commands)
			.then(console.log('Slash commands registered'));

		//Log message when everything is done
		console.log(`Bot activated, logged in as ${client.user.tag}.`);
		//Lastly start interval to post random animals
		setInterval(() => randomAnimals(client), 1800000);
	},
};
//Random animals function
async function randomAnimals(client) {
	try {
		const destinations = {
			cats: [
				await client.fetchWebhook('854155515696119819', 'tjkSs0YeD0rYMgyVGEQfNyYvjtal5sbOczctEwwXDdG8uPk3WcPBfAO10U2XH0xYmcMv'),
				new Discord.WebhookClient({ url: 'https://discord.com/api/webhooks/869111109662146580/Rin0NCPvR5EoWJkUJluko0wtHS1QKfi1gP25EHrRTK0Vf5TfCxjr6YgAOim4r6Z0j8Re' }),
			],
			dogs: [
				await client.fetchWebhook('869118433105682442', 'mLa7tBZFP2pW6s4sd9NOjmkmO8siHwi2TjW2OwoZ2EwvkMR5joDZhtKU9N56LPvxCXcq')
			]
		};

		const { file: catImage } = await fetch('https://aws.random.cat/meow').then(response => response.json());
		const { message: dogImage } = await fetch('https://dog.ceo/api/breeds/image/random').then(response => response.json());

		destinations.cats.forEach(async (destination) => {
			await destination.send(catImage).catch(err => console.error(err));
		});
		destinations.dogs.forEach(async (destination) => {
			await destination.send(dogImage).catch(err => console.error(err));
		});

	} catch (error) {
		console.error(error);
	}
}