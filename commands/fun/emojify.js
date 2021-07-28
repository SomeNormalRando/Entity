module.exports = {
	name: 'emojify',
	aliases: [],
	description: 'Turns text into emoji',
	usage: '<text>',
	args: true,
	cooldown: 3,
	guildOnly: true,
	botPermissions: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
	execute(message, args) {
		const emojis = {
			a: '🇦', b: '🇧', c: '🇨', d: '🇩',
			e: '🇪', f: '🇫', g: '🇬', h: '🇭',
			i: '🇮', j: '🇯', k: '🇰', l: '🇱',
			m: '🇲', n: '🇳', o: '🇴', p: '🇵',
			q: '🇶', r: '🇷', s: '🇸', t: '🇹',
			u: '🇺', v: '🇻', w: '🇼', x: '🇽',
			y: '🇾', z: '🇿', 0: '0️⃣', 1: '1️⃣',
			2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣',
			6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣',
			10: '🔟', '#': '#️⃣', '*': '*️⃣',
			'!': '❗', '?': '❓',
		}
		let content = args.join(" ").toLowerCase().split('');
		content.forEach((element, index) => {
			if (emojis.hasOwnProperty(element)) {
				content[index] = emojis[element];
			} else if(element == ' ') {
				content[index] = '  ';
			}
		});
		message.channel.send(content.join(' '));
	},
};