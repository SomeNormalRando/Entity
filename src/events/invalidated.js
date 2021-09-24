"use strict";
module.exports = {
	name: "invalidated",
	once: false,
	execute() {
		console.log("Session invalidated, process will exit now.");
		process.exit();
	},
};
