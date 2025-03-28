const { Events } = require("discord.js");
const config = require("../config.json");
const { EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
    //Reaction 
    name: Events.MessageReactionAdd,
    once: false,
    async execute(message) {
        console.log("[DEBUG] Processing message:", {
            author: message.author.tag,
            content: message.content,
            guildId: message.guild?.id,
            reaction: message.emoji.name,

          });
        if (message.guild?.id !== process.env.GUILD_ID) {
            console.log("[FILTER] Message skipped - wrong server");
            return;       
        }

    }
}
