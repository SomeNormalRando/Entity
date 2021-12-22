"use strict";
module.exports = {
	// Used for error messages shown to the user
	errorEmojis: ["😮", "☹", "😦", "🙁"],
	// Used for separating errors in the console
	errorSep: "".padStart(process.stdout.columns, "─"),
	DEVELOPERS: ["728910425780912199"],
	// Console escape code for moving the cursor to the start of the line and deleting everything on the current line
	RESET_ESCAPE_CODE: "\r\u001b[K",
	EMBED_COLOUR: "#2F3136",
	EMBED_LIMITS: {
		TOTAL_CHARACTERS: 6000,
		EMBEDS_PER_MESSAGE: 10,
		TITLE: 256,
		DESCRIPTION: 4096,
		FIELD_NAME: 256,
		FIELD_VALUE: 1024
	}
};
