const { MessageActionRow } = require("discord.js");

module.exports = {
	/**
	 * Converts snake case to title case
	 * @param {string} str String to normalize
	 */
	normalizeStr(str) {
		str = str.toLowerCase();
		str = str.split('_');
		str.forEach((element, index) => {
			str[index] = element.charAt(0).toUpperCase() + element.substr(1);
		});
		return str.join(' ');
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