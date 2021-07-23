const fetch = require('node-fetch');
const { Tags, Prefixes, Counting } = require('../dbindex.js')
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Bot activated, logged in as ${client.user.tag}.`);
        client.user.setActivity('%help', { type: 'WATCHING' });
    
        Tags.sync({force:true});
        Prefixes.sync();
        Counting.sync()
        setInterval(() => randomCats(client), 1800000);
    }
}
async function randomCats(client) {
    try {
        const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
        const catWebhook = await client.fetchWebhook('854155515696119819', 'tjkSs0YeD0rYMgyVGEQfNyYvjtal5sbOczctEwwXDdG8uPk3WcPBfAO10U2XH0xYmcMv')
        await catWebhook.send(file).catch(err => console.error(err))
    } catch (error) {
        console.error('Error trying to send: ', error);
    }
}