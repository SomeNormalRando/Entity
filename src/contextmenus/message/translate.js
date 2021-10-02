"use strict";
const { Util } = require("../../index.js");
module.exports = {
	name: "Translate to English",
	execute(interaction, message) {
		const text = Util.removeMarkdown(message.content);
		const link = `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(text)}&op=translate`;
		interaction.reply({
			content: `English translation of \`${text}\`: ${link}`,
			ephemeral: true
		});
	}
};
