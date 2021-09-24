/* eslint-disable no-extend-native */
"use strict";
const { MessageActionRow } = require("discord.js");

Array.prototype.random = function random() {
	return this[Math.floor(Math.random() * this.length)];
};

/**
 * Converts SNAKE_CASE to Title Case
 * @param {Array.<regex>} exceptions Patterns to ignore when converting
 * @returns {string} The string in title case
 * @memberof String
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
	 * Fills an array from an object's keys n times, where n is the value of the key
	 * @param {Object} obj Object to generate the array from, for example { "foo": 2, "bar": 1, 42: 2 } produces ["foo", "foo", "bar", 42, 42]
	 * @returns {Array} The generated array
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
		let result = str;
		for (const regex of regexes) {
			result = result.replace(regex, "$1");
		}
		return str;
	},
	/**
	 * Disables all buttons or a specific button in a MessageActionRow
	 * @param {string} id The custom id of the button to disable
	 * @param {...MessageActionRow} rows The row(s)
	 */
	disableButtons(id, ...rows) {
		rows.forEach(row => {
			for (const button of row.components) {
				if (button.customId === id) {
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
		rows.forEach(row => {
			for (const button of row.components) {
				button.setDisabled(true);
			}
		});
		return [rows];
	},
};
