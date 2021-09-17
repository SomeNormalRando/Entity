const { MessageActionRow } = require("discord.js");

Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
};

/**
 * Converts SNAKE_CASE to Title Case
 * @param {Array.<regex>} exceptions Patterns to ignore when converting
 * @returns {string} The string in title case
 * @memberof String
 */
String.prototype.toTitleCase = function(...exceptions) {
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
	 * Removes markdown from a string
	 * @param {string} str String to remove markdown from
	 * @returns {string} The string with markdown removed
	 */
	removeMarkdown(str) {
		const regexes = [
			/\*\*(.*)\*\*/,
			/\*(.*)\*/,
			/_(.*)_/,
			/__(.*)__/,
			/\|\|(.*)\|\|/,
			/`(.*)`/,
			/```(.*)```/,
		];
		for (const regex of regexes) {
			str = str.replace(regex, "$1");
		}
		return str;
	},
	/**
	 * Converts snake case to title case
	 * @param {string} str String to normalize
	 * @returns {string} The string in title case
	 */
	normalizeStr(str) {
		str = str.toLowerCase();
		str = str.replace(/_/g, " ");
		str = str.split(" ");
		str.forEach((element, index) => {
			str[index] = element.charAt(0).toUpperCase() + element.substr(1);
		});
		return str.join(" ");
	},
	/**
	 * Disables all buttons or a specific button in a MessageActionRow
	 * @param {string} id The custom id of the button to disable
	 * @param {...MessageActionRow} rows The row(s)
	 */
	disableButtons(id, ...rows) {
		rows.forEach((row) => {
			for (const button of row.components) {
				if (button.customId == id) {
					button.setDisabled(true);
				}
			}
		});
	},
	/**
	 * Disables all buttons of the provided MessageActionRow(s)
	 * @param  {...MessageActionRow} rows The row(s) to disable buttons for
	 * @returns {MessageActionRow} a
	 */
	disableAllButtons(...rows) {
		rows.forEach((row) => {
			for (const button of row.components) {
				button.setDisabled(true);
			}
		});
		return [rows];
	},
};