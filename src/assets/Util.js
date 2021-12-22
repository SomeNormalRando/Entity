"use strict";
// eslint-disable-next-line id-length
const { ApplicationCommandManager, MessageActionRow, MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const { EMBED_COLOUR } = require("./Constants");

const { errorEmojis, errorSep } = require("./Constants");

// eslint-disable-next-line no-extend-native
Array.prototype.random = function random() {
	return this[Math.floor(Math.random() * this.length)];
};

module.exports = {
	discordEval: require("./eval.js"),
	/**
	 * Creates a user-friendly error embed
	 * @param {String} [text=""] Extra text to add after the default title
	 * @param {String} [description=""] The description for the embed
	 * @returns {MessageEmbed} The embed
	 */
	createErrorEmbed(text = "", description = "") {
		return new MessageEmbed()
			.setTitle(`An error occurred ${text}${text ? " " : ""}${errorEmojis.random()}`)
			.setColor(EMBED_COLOUR)
			.setDescription(description || "If this keeps happening, try contacting my developer.");
	},
	/**
	 * Fetches a resource with error handling and turns it into JSON
	 * @param {String} url URL to fetch from
	 * @returns {Promise<*>} A promise which resolves to the fetched resource or rejects if there is an error
	 */
	fetchResource(url) {
		return new Promise((resolve, reject) => {
			fetch(url)
				.then(response => {
					if (response.ok) resolve(response.json());
					else throw new Error(`Error while fetching from \`${url}\`, HTTP status code ${response.status}`);
				})
				.catch(err => {
					console.error(`${errorSep}\n\x1b[1;91mError while fetching from \`${url}\`:\x1b[0m`, err, `\n${errorSep}`);
					reject(err);
				});
		});
	},
	// #region String & array manipulation
	/**
	 * Converts a string to title case
	 * @param {String} str String to convert
	 * @param {...RegExp} exceptions Exceptions to ignore and turn into uppercase
	 * @returns {String} The string in title case
	 */
	toTitleCase(str, ...exceptions) {
		const strArr = str.toLowerCase().replace(/_/g, " ").split(" ");
		const result = [];
		for (const element of strArr) {
			const matches = exceptions.some(e => e.test(element));
			if (matches) result.push(element.toUpperCase());
			else result.push(element.charAt(0).toUpperCase() + element.substr(1));
		}
		return result.join(" ");
	},
	/**
	 * Trims a string to the specified length if it exceeds it, and removes whitespace from both ends of it
	 * @param {String} str String to trim
	 * @param {Number} max The maximum length
	 * @param {String} [extraText] Optional extra text to add to the end of the string
	 * @returns {String} Result after trimming
	 * @example
	 * trim("ABCDEFG", 4) // returns "ABCD"
	 * trim("ABCDEFG", 4, "z"); // returns "ABCz"
	 */
	trimStr(str, max, extraText = "") {
		str = str.trim();
		return str.length < max ? str : `${str.slice(0, max - extraText.length)}${extraText}`;
	},
	/**
	 * Trims an array to the specified length and adds text to the end of the string
	 * @param {any[]} arr Array to trim
	 * @param {Number} max The maximum length
	 * @param {String} [sep=", "] The separator
	 * @returns {String} The joined array after trimming and adding text
	 */
	trimArr(arr, max, sep = ", ") {
		const joined = arr.join(sep);
		if (joined.length <= max) return joined;

		const newArr = [...arr];
		while (newArr.join(sep).length + `...${arr.length - newArr.length} more`.length > max) {
			newArr.pop();
		}
		const result = newArr.join(sep);
		return `${result} ...${arr.length - newArr.length} more`;
	},
	/**
	 * Fills an array from an object's keys *n* times, where *n* is the value of the key
	 * @param {Object} obj Object to generate the array from
	 * @returns {Array} The generated array
	 * @example
	 * fillArray({ "foo": 2, "bar": 1, 42: 3 }); // returns ["foo", "foo", "bar", 42, 42, 42]
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
	// #endregion

	// #region Buttons
	/**
	 * Changes the style of the button(s) with the specified id in the specified MessageActionRow(s)
	 * @param {String} id The custom id of the button(s) to change the style of, '_all' to change all
	 * @param {String} newStyle The new style for the buttons
	 * @param {...MessageActionRow} rows The row(s) to change the button style
	 * @returns {MessageActionRow[]} An array of new MessageActionRow(s) with the style of the button(s) changed
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
	 * @param {...MessageActionRow} rows The row(s) to disable the button
	 * @returns {MessageActionRow[]} An array of new MessageActionRow(s) with the button(s) disabled
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

	editRows,
	// #endregion

	SlashCommand: class SlashCommand {
		/**
		 * @typedef {Object[]} SlashCommandOptions
		 * @property {String} name 1-32 character name of the option
		 * @property {String} description 1-100 description of the option
		 * @property {"SUB_COMMAND"|"SUB_COMMAND_GROUP"|"STRING"|"INTEGER"|"BOOLEAN"|"USER"|"CHANNEL"|"ROLE"|"MENTIONABLE"|"NUMBER"} type [Type of the option](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type)
		 * @property {Boolean} [required=false] Whether the option is required or not (default `false`)
		 * @property {Boolean} [autocomplete=false] Whether to enable autocomplete interaction for this option (cannot be set to true if `choices` are present)
		 * @property {Object[]} [choices] [Choices for `STRING`, `INTEGER`, and `NUMBER` types for the user to pick from, max 25](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure)
		 * @property {String} [choices.name] 1-100 character choice name
		 * @property {String|Number|Boolean} [choices.value] Value of the choice, up to 100 characters if string
		 * @property {SlashCommandOptions} [options] If the option is a subcommand or subcommand group type, this nested options will be the parameters
		 */

		/**
		 * Transforms a slash command into one that the Discord API accepts
		 * @param {Object} data [Data for the slash command](https://discord.com/developers/docs/interactions/application-commands#application-command-object)
		 * @param {String} data.name 1-32 character name of the slash command
		 * @param {String} data.description 1-100 character description of the slash command
		 * @param {SlashCommandOptions} [data.options] [Array of application command option(s)](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure)
		 * @param {Boolean} [data.default_permission] Whether the command is enabled by default when the app is added to a guild
		 * @example
		 * const command = new SlashCommand({
		 *     name: "say",
		 *     description: "Make the bot say something!",
		 *     options: [
		 *         {
		 *            name: "content",
		 *            description: "Text to make the bot say",
		 *            type: "STRING", // Can also be an integer
		 *            required: true
		 *         }
		 *     ],
		 * })
		 */
		constructor(data) {
			// eslint-disable-next-line no-constructor-return
			return ApplicationCommandManager.transformCommand(data);
		}
	},

	// #region idk
	/**
	 * Returns 's' if the provided number is equal to one
	 * @param {Number} num Number
	 * @returns {""|"s"}
	 * @example
	 * const apples = 1;
	 * const oranges = 3;
	 * console.log(`There is ${apples} apple${addS(apples)} and ${oranges} orange${addS(oranges)}.`);
	 * // There is 1 apple and 3 oranges
	 */
	addS(num) {
		if (num === 1) return "";
		return "s";
	},
	testCol(hex, customString = "None") {
		if (hex === "#000000") return customString;
		return hex;
	},
	toYesNo(bool) {
		if (bool === true) return "Yes";
		else if (bool === false) return "No";
		throw new TypeError("Parameter is not a boolean");
	},
	// #endregion
};

/**
 * Creates an array of new MessageActionRows and executes a function on each row
 * @param {MessageActionRow[]} rows Array of MessageActionRow(s) to create new rows from
 * @param {Function} fn Function to execute on each MessageActionRow
 * @returns {MessageActionRow[]} An array of new MessageActionRow(s)
 */
function editRows(rows, fn) {
	const newRows = [];
	for (const row of rows) {
		newRows.push(fn(new MessageActionRow(row)));
	}
	return newRows;
}
