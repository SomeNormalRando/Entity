"use strict";
module.exports = {
	name: "ratelimit",
	once: false,
	execute(data) {
		console.log(`RATELIMITED:\n${data}`);
	},
};
