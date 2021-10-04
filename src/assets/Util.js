/* eslint-disable max-len */
/* eslint-disable no-extend-native */
"use strict";

const { ApplicationCommandManager, MessageActionRow } = require("discord.js");

/**
 * Gets a random element from an array
 * @returns {*} The random element
 */
Array.prototype.random = function random() {
	return this[Math.floor(Math.random() * this.length)];
};

/**
 * Converts SNAKE_CASE to Title Case
 * @param {RegExp[]} exceptions Patterns to ignore when converting
 * @returns {String} The string in title case
 */
String.prototype.toTitleCase = function toTitleCase(...exceptions) {
	const result = [];
	let str = this.toLowerCase();
	str = str.replace(/_/g, " ");
	str = str.split(" ");
	for (const element of str) {
		const a = exceptions.some(e => e.test(element));
		if (a) result.push(element.toUpperCase());
		else result.push(element.charAt(0).toUpperCase() + element.substr(1));
	}
	return result.join(" ");
};
module.exports = {
	/**
	 * Trims a string to the specified length if it exceeds it, and removes whitespace from both ends of a string
	 * @param {String} str String to trim
	 * @param {Number} max The maximum length
	 * @param {String} [extraText] Optional extra text to add to the end of the string
	 * @returns {String} Result after trimming
	 * @example
	 * trim("ABCDEFG", 4) // returns "ABCD"
	 * trim("ABCDEFG", 4, "z"); // returns "ABCz"
	 */
	trimStr(str, max, extraText) {
		str = str.trim();
		return str.length > max ? `${str.slice(0, max - (extraText.length ?? 0))}${extraText ?? ""}` : str;
	},

	/**
	 * Fills an array from an object's keys n times, where n is the value of the key
	 * @param {Object} obj Object to generate the array from
	 * @returns {Array} The generated array
	 * @example
	 * fillArray({ "foo": 2, "bar": 1, 42: 3 });
	 * // returns ["foo", "foo", "bar", 42, 42, 42]
	 */
	fillArray(obj) {
		const result = [];
		for (const element of Object.keys(obj)) {
			const amount = obj[element];
			for (let i = 0; i < amount; i++) {
				result.push(element);
			}
		}
		return result;
	},

	/**
	 * Removes Discord-flavoured markdown from a string
	 * @param {String} str String to remove markdown from
	 * @returns {String} The string with markdown removed
	 */
	removeMarkdown(str) {
		const regexes = [
			/\*\*(.+?)\*\*/g,
			/\*(.+?)\*/g,
			/__(.+?)__/g,
			/_(.+?)_/g,
			/\|\|(.+?)\|\|/g,
			/```([\w\W]+?)```/g,
			/`(.+?)`/g,
		];
		let result = str;
		for (const regex of regexes) {
			result = result.replace(regex, "$1");
		}
		return str;
	},

	/**
	 * Changes the style of the button(s) with the specified id in the specified MessageActionRow(s)
	 * @param {String} id The custom id of the button(s) to change the style of, '_all' to change all
	 * @param {String} newStyle The new style for the buttons
	 * @param {...Discord.MessageActionRow} rows The row(s) to change the button style
	 * @returns {Discord.MessageActionRow[]} An array of new MessageActionRow(s) with the style of the button(s) changed
	 */
	changeButtonStyle(id, newStyle, ...rows) {
		if (typeof id !== "string") throw new TypeError("Parameter 'id' must be a string.");
		if (typeof newStyle !== "string") throw new TypeError("Parameter 'newStyle' must be a string.");
		return editRows(rows, row => {
			if (id === "_all") {
				for (const button of row.components) {
					button.setStyle(newStyle);
				}
			} else {
				for (const button of row.components) {
					if (button.customId === id) {
						button.setStyle(newStyle);
					}
				}
			}
			return row;
		});
	},

	/**
	 * Disables the button(s) with the specified id in the specified MessageActionRow(s)
	 * @param {String} id The custom id of the button(s) to disable, '_all' to disable all
	 * @param {...Discord.MessageActionRow} rows The row(s) to disable the button
	 * @returns {Discord.MessageActionRow[]} An array of new MessageActionRow(s) with the button(s) disabled
	 */
	disableButtons(id, ...rows) {
		if (typeof id !== "string") throw new TypeError("Parameter 'id' must be a string.");
		return editRows(rows, row => {
			if (id === "_all") {
				for (const button of row.components) {
					button.setDisabled(true);
				}
			} else {
				for (const button of row.components) {
					if (button.customId === id) {
						button.setDisabled(true);
					}
				}
			}
			return row;
		});
	},

	/**
	 * Creates an array of new MessageActionRows and executes a function on each row
	 * @param {Discord.MessageActionRow[]} rows Array of MessageActionRow(s) to create new rows from
	 * @param {Function} fn Function to execute on each MessageActionRow
	 * @returns {Discord.MessageActionRow[]} An array of new MessageActionRow(s)
	 */
	editRows,

	// This is mostly for Intellisense
	/**
	 * @typedef {Object[]} SlashCommandOptions
	 * @property {String} name 1-32 character name of the option
	 * @property {String} description 1-100 description of the option
	 * @property {String|Number} type [Type of the option](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type)
	 * @property {Boolean} [required=false] Whether the option is required or not (default `false`)
	 * @property {Object[]} [choices] [Choices for `STRING`, `INTEGER`, and `NUMBER` types for the user to pick from, max 25](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure)
	 * @property {String} [choices.name] 1-100 character choice name
	 * @property {String|Number} [choice.value] Value of the choice, up to 100 characters if string
	 * @property {SlashCommandOptions} [options] If the option is a subcommand or subcommand group type, this nested options will be the parameters
	 */
	/**
	 * Returns a slash command
	 * @param {Object} data [Data for the slash command](https://discord.com/developers/docs/interactions/application-commands#application-command-object)
	 * @param {String} data.name 1-32 character name of the slash command
	 * @param {String} data.description 1-100 character description of the slash command
	 * @param {SlashCommandOptions} [data.options] [Array of application command option(s)](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure)
	 * @param {Boolean} [data.default_permission] Whether the command is enabled by default when the app is added to a guild

	 * @returns {Object} The slash command with option types changed to numbers
	 * @example
	 * const command = new SlashCommand({
	 *     name: "say",
	 *     description: "Make the bot say something of your choice",
	 *     options: [
	 *         {
	 *            name: "content",
	 *            description: "The content to make the bot say",
	 *            type: "STRING",
	 *            required: true
	 *         }
	 *     ],
	 * })
	 */
	SlashCommand: class SlashCommand {
		constructor(data) {
			// eslint-disable-next-line no-constructor-return
			return ApplicationCommandManager.transformCommand(data);
		}
	}
};
function editRows(rows, fn) {
	const newRows = [];
	for (const row of rows) {
		newRows.push(fn(new MessageActionRow(row)));
	}
	return newRows;
}
