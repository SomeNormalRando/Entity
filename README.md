# Entity
Source code for my Discord bot, Entity

[Invite link](https://discord.com/api/oauth2/authorize?client_id=812960290718482483&permissions=738585664&scope=applications.commands%20bot) (it isn't always online because I host it locally)

## Stuff
<small>mostly to remind me if i forget</small>

All source code is in `src/`

`index.js` - where I export everything

`bot.js` - the actual file that starts the bot, plus command and event handlers

`commands/` - commands (sorted by category inside subdirectories, `context-menus` is for context menus and is different)

`events/` - events

`assets/` - images and utility functions

`config.json` - config file

`env.json` - (gitignored) environment variable file, structure is as below:
```json
{
	// bot token
	"TOKEN": "abcdefg",
	// user IDs of bot owner(s)
	// will have full access to everything
	"OWNERS": ["987654321987654321"],
	// the IDs of guilds to register guild commands
	"GUILD_WHITELIST": ["123456789123456789"],
	// ID of the channel to log bot guild joins and leaves
	"LOG_CHANNEL": "123456789123456789",
}
```
