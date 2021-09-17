module.exports = {
	name: "invalidated",
	once: false,
	execute() {
		console.log("Session invalidated");
		process.exit();
	},
};