const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config()
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	require('./handler/commandHandler.js');
	require('./handler/eventHandler.js')
});

client.login(process.env.TOKEN);

module.exports = {client}