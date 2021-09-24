/* eslint-disable object-property-newline */
"use strict";
const emojis = {
	"a": "🇦", "b": "🇧", "c": "🇨", "d": "🇩",
	"e": "🇪", "f": "🇫", "g": "🇬", "h": "🇭",
	"i": "🇮", "j": "🇯", "k": "🇰", "l": "🇱",
	"m": "🇲", "n": "🇳", "o": "🇴", "p": "🇵",
	"q": "🇶", "r": "🇷", "s": "🇸", "t": "🇹",
	"u": "🇺", "v": "🇻", "w": "🇼", "x": "🇽",
	"y": "🇾", "z": "🇿", "0": "0️⃣", "1": "1️⃣",
	"2": "2️⃣", "3": "3️⃣", "4": "4️⃣", "5": "5️⃣",
	"6": "6️⃣", "7": "7️⃣", "8": "8️⃣", "9": "9️⃣",
	"10": "🔟", "#": "#️⃣", "*": "*️⃣",
	"!": "❗", "?": "❓"
};
module.exports = {
	data: {
		name: "emojify",
		description: "Emojify text!",
		options: [{
			name: "text",
			type: "STRING",
			description: "The text to emojify",
			required: true,
		}]
	},
	async execute(interaction, args) {
		const text = args.text.toLowerCase().split("");
		const result = [];

		for (const char of text) {
			result.push(emojis[char] || char);
		}

		await interaction.reply(result.join(" "));
	},
};
