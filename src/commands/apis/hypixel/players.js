"use strict";
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { Constants: { EMBED_COLOUR }, Util: { createErrorEmbed, fetchResource }, env: { API_KEYS } } = require("../../../index");

const url = `https://api.hypixel.net/counts?key=${API_KEYS.HYPIXEL}`;
const BEDWARS_NORMAL_MODES = ["BEDWARS_EIGHT_ONE", "BEDWARS_EIGHT_TWO", "BEDWARS_FOUR_THREE", "BEDWARS_FOUR_FOUR", "BEDWARS_TWO_FOUR", "BEDWARS_PRACTICE"];

const defaultRow = new MessageActionRow()
	.addComponents(
		new MessageSelectMenu()
			.setCustomId("select")
			.setPlaceholder("Detailed view")
			.addOptions([
				{
					label: "General",
					description: "General player counts",
					value: "GENERAL",
				},
				{
					label: "SkyBlock",
					description: "Detailed player counts for SkyBlock",
					value: "SKYBLOCK"
				},
				{
					label: "Bed Wars",
					description: "Detailed player counts for Bed Wars",
					value: "BEDWARS"
				},
				{
					label: "SkyWars",
					description: "Detailed player counts for SkyWars",
					value: "SKYWARS"
				},
				{
					label: "Murder Mystery",
					description: "Detailed player counts for Murder Mystery",
					value: "MURDER_MYSTERY"
				},
				{
					label: "TNT Games",
					description: "Detailed player counts for the TNT Games",
					value: "TNTGAMES"
				},

				{
					label: "Classic Games",
					description: "Detailed player counts for the Classic Games",
					value: "LEGACY"
				},
				{
					label: "Miscellaneous",
					description: "Detailed player counts for every other gamemode",
					value: "MISC"
				}
			])
	);
module.exports = interaction => {
	fetchResource(url).then(async ({ success, games, playerCount }) => {
		if (success !== true) throw new Error(`Property \`success\` was not true when fetching from url ${url} (at command /hypixel players)`);
		const fetchedTimestamp = Date.now();

		const initialEmbed = new MessageEmbed()
			.setTitle("Hypixel Player Counts")
			.setColor(EMBED_COLOUR)
			.setDescription(`**Total players: ${playerCount}**\nMain lobby: ${games.MAIN_LOBBY.players}\nTournament lobby: ${games.TOURNAMENT_LOBBY.players}`)
			.addFields([
				{ name: "SkyBlock", value: `${games.SKYBLOCK.players}`, inline: true },
				{ name: "Bed Wars", value: `${games.BEDWARS.players}`, inline: true },
				{ name: "SkyWars", value: `${games.SKYWARS.players}`, inline: true },
				{ name: "Murder Mystery", value: `${games.MURDER_MYSTERY.players}`, inline: true },
				{ name: "TNT Games", value: `${games.TNTGAMES.players}`, inline: true },
				{ name: "Classic Games", value: `${games.LEGACY.players}`, inline: true },
			])
			.setFooter("Information fetched at")
			.setTimestamp(fetchedTimestamp);

		const initialRow = new MessageActionRow(defaultRow);
		initialRow.components[0].options.find(e => e.value === "GENERAL").default = true;

		const msg = await interaction.editReply({ embeds: [initialEmbed], components: [initialRow] });
		const collector = msg.createMessageComponentCollector({ componentType: "SELECT_MENU", time: 300000 });

		collector.on("collect", async i => {
			if (i.user.id !== interaction.user.id) return i.reply({ content: "You aren't the one using this command.", ephemeral: true });
			let embed = new MessageEmbed()
				.setColor(EMBED_COLOUR)
				.setFooter("Information fetched at")
				.setTimestamp(fetchedTimestamp);
			// eslint-disable-next-line one-var
			let row = new MessageActionRow(defaultRow);
			row.components[0].options.find(e => e.value === i.values[0]).default = true;

			const { players, modes } = games[i.values[0]] ?? { players: null, modes: null };

			switch (i.values[0]) {
				case "GENERAL": {
					embed = initialEmbed;
					row = initialRow;
					break;
				}
				case "SKYBLOCK": {
					embed
						.setTitle("Hypixel Player Counts - Skyblock")
						.setDescription(`\
Private Island: **${modes.dynamic}**
Hub: **${modes.hub}**
The Farming Islands: **${modes.farming_1}**
The Park: **${modes.foraging_1}**
Gold Mine: **${modes.mining_1}**
Deep Caverns: **${modes.mining_2}**
Dwarven Mines: **${modes.mining_3}**
Crystal Hollows: **${modes.crystal_hollows}**
Spider's Den: **${modes.combat_1}**
Blazing Fortress: **${modes.combat_2}**
The End: **${modes.combat_3}**
Dungeon Hub: **${modes.dungeon_hub}**
Dungeons: **${modes.dungeon}**
**Total players: ${players}**`, true);
					break;
				}
				case "BEDWARS": {
					const other = Object.keys(modes).filter(e => !BEDWARS_NORMAL_MODES.includes(e)).reduce((prev, curr) => prev + modes[curr], 0);

					embed
						.setTitle("Hypixel Player Counts - Bed Wars")
						.setDescription(`\
1v1v1v1: **${modes.BEDWARS_EIGHT_ONE}**
2v2v2v2: **${modes.BEDWARS_EIGHT_TWO}**
3v3v3v3: **${modes.BEDWARS_FOUR_THREE}**
4v4v4v4: **${modes.BEDWARS_FOUR_FOUR}**
4v4: **${modes.BEDWARS_TWO_FOUR}**
Practice: **${modes.BEDWARS_PRACTICE}**
Other: **${other}**
**Total players: ${players}**`, true);
					break;
				}
				case "SKYWARS": {
					embed
						.setTitle("Hypixel Player Counts - SkyWars")
						.setDescription(`\
Ranked: **${modes.ranked_normal}**
Solo (normal): **${modes.solo_normal}**
Solo (insane): **${modes.solo_insane}**
Teams (normal): **${modes.teams_normal}**
Teams (insane): **${modes.teams_insane}**
**Total players: ${players}**`, true);
					break;
				}
				case "MURDER_MYSTERY": {
					embed
						.setTitle("Hypixel Player Counts - Murder Mystery")
						.setDescription(`\
Classic: **${modes.MURDER_CLASSIC ?? 0}**
Double Up: **${modes.MURDER_DOUBLE_UP ?? 0}**
Assassins: **${modes.MURDER_ASSASSINS ?? 0}**
Infection: **${modes.MURDER_INFECTION ?? 0}**
**Total players: ${players}**`, true);
					break;
				}
				case "TNTGAMES": {
					embed
						.setTitle("Hypixel Player Counts - TNT Games")
						.setDescription(`\
Bow Spleef: **${modes.BOWSPLEEF ?? 0}**
TNT Run: **${modes.TNTRUN ?? 0}**
TNT Tag: **${modes.TNTAG ?? 0}**
Wizards: **${modes.CAPTURE ?? 0}**
**Total players: ${players}**`, true);
					break;
				}
				case "LEGACY": {
					embed
						.setTitle("Hypixel Player Counts - Classic Games")
						.setDescription(`
Quakecraft: **${modes.QUAKECRAFT ?? 0}**
Arena Brawl: **${modes.ARENA ?? 0}**
The Walls: **${modes.WALLS ?? 0}**
VampireZ: **${modes.VAMPIREZ ?? 0}**
Turbo Kart Racers: **${modes.GINGERBREAD ?? 0}**
Paintball Warfare: **${modes.PAINTBALL ?? 0}**
**Total players: ${players}**`);
					break;
				}
				case "MISC": {
					embed
						.setTitle("Hypixel Player Counts - Miscellaneous")
						.setDescription(`
UHC Champions: **${games.UHC.players}**
Speed UHC: **${games.SPEED_UHC.players}**
The Pit: **${games.PIT.players}**
Housing: **${games.HOUSING.players}**
Mega Walls: **${games.WALLS3.players}**
Prototype Games: **${games.PROTOTYPE.players}**
Replay: **${games.REPLAY.players}**
Limbo: **${games.LIMBO.players}**
AFK Lobby: **${games.IDLE.players}**`);
					break;
				}
				default: {
					embed = initialEmbed;
					i.reply({ content: "There's currently nothing implemented for this option. Please notify the developer(s) if you can.", ephemeral: true });
				}
			}
			await i.update({ embeds: [embed], components: [row] });
		});
	}).catch(err => {
		interaction.editReply({ embeds: [createErrorEmbed()] });
		console.error(err);
	});
};
