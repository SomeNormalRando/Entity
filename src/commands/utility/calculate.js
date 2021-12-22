"use strict";
const { Collection, Formatters, MessageEmbed } = require("discord.js");
const { performance } = require("perf_hooks");
const { Util: { SlashCommand, trimStr }, Constants: { EMBED_COLOUR, EMBED_LIMITS: { FIELD_VALUE } } } = require("../../index");
const symbols = new Collection()
	.set("sqrt", "√")
	.set("cbrt", "∛");
const keys = [];
for (const value of symbols.values()) keys.push(value);
const regex = new RegExp(`[^\\d. ()+\\-*/%${keys.join("")}e]+?`, "g");
const numRegex = "(\\d+(\\.\\d+)?)";
module.exports = {
	data: new SlashCommand({
		name: "calculate",
		description: "Calculate stuff! (Note that invalid characters will be removed)",
		options: [{
			name: "expression",
			description: "The mathematical expression to calculate",
			type: "STRING",
			required: true
		}]
	}),
	cooldown: 5,
	execute(interaction, args) {
		const start = performance.now();

		let expr = args.expression;
		const embed = new MessageEmbed()
			.setTitle("Calculation")
			.setColor(EMBED_COLOUR)
			.addField("Original Input", trimStr(Formatters.codeBlock("js", expr ?? "[Empty]"), FIELD_VALUE, "..."));
		// Turn functions into symbols
		for (const [key, value] of symbols) {
			expr = expr.replace(new RegExp(`${key}\\(${numRegex}\\)`, "g"), `${value}$1`);
		}
		// Strip all invalid characters
		expr = expr.replace(regex, "");

		embed.addField("Processed Input", trimStr(Formatters.codeBlock("js", expr || "[Empty]"), FIELD_VALUE, "..."));

		// Turn symbols into JS functions
		for (const [key, value] of symbols) {
			expr = expr.replace(new RegExp(`${value}${numRegex}`, "g"), `Math.${key}($1)`);
		}

		try {
			// eslint-disable-next-line no-new-func
			const result = Formatters.codeBlock("js", Function(`return ${expr}`)() || "[Empty]");
			embed.addField("Result", trimStr(result, FIELD_VALUE, "..."))
				.setTimestamp()
				.setFooter(`Calculated in ${(performance.now() - start).toFixed(4)} ms`);
		} catch {
			embed.addField("Result", "Invalid input").setTimestamp();
		}
		interaction.reply({ embeds: [embed] });
	}
};
