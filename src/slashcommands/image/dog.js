const Discord = require('discord.js');
const fetch = require('node-fetch');
const { normalizeStr } = require('../../assets/util.js');
module.exports = {
	data: {
		name: 'dog',
		description: 'Get some random dog pictures',
		options: [
			{
				name: 'random',
				description: 'Get a random dog picture of any or a particular breed',
				type: 'SUB_COMMAND',
				options: [{
					name: 'breed',
					description: 'A dog breed to get',
					type: 'STRING',
					required: false,
				}],
			},
			{
				name: 'list',
				description: 'List all gettable dog breeds for the /dog random command',
				type: 'SUB_COMMAND',
			},
		]
	},
	async execute(interaction, args) {
		if (args.subcommand == 'list') {
			let breedList = await fetch('https://dog.ceo/api/breeds/list/all').then(res => res.json());
			breedList = Object.keys(breedList.message);
			breedList.forEach((element, index) => {
				breedList[index] = Discord.Formatters.inlineCode(element);
			});
			const embed = new Discord.MessageEmbed()
				.setTitle('Dog Breeds')
				.setDescription(breedList.join(', '));
			return interaction.reply({ embeds: [embed] });
		}
		const breed = interaction.options.getString('breed');
		let image, title;
		if (breed) {
			image = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
				.then(response => response.json())
				.catch(err => {
					console.error(err);
					interaction.reply({ content: 'An error occured.', ephemeral: true });
				});
			title = `Your ${normalizeStr(breed)} dog`;
		}
		else {
			image = await fetch('https://dog.ceo/api/breeds/image/random')
				.then(response => response.json())
				.catch(err => {
					console.error(err);
					interaction.reply({ content: 'An error occured.', ephemeral: true });
				});
			title = 'Your random dog';
		}
		const dogEmbed = new Discord.MessageEmbed()
			.setTitle(title)
			.setColor('#2F3136')
			.setImage(image.message);
		await interaction.reply({ embeds: [dogEmbed] })
			.catch(err => interaction.reply({ content: 'That isn\'t a valid breed. Type `/dog list` for a list of breeds.', ephemeral: true }));
	},
};