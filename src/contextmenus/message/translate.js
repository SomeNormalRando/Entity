module.exports = {
	name: 'Translate to English',
	execute(interaction, message) {
		const text = message.content;
		interaction.reply({ content: `English translation of \`${text}\`: \nhttps://translate.google.com/?sl=auto&tl=en&text=${text}&op=translate`, ephemeral: true });
	}
};