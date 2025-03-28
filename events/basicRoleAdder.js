const { Events } = require("discord.js");
const config = require("../config.json");
const { EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
    //Reaction 
    name: Events.MessageReaction,
    once: false,
    async execute(message) {
     console.log("[DEBUG] Processing message:", {
        author: message.author.tag,
        content: message.content,
        reaction: message.reaction.emoji.name,
        guildId: message.guild?.id,
     });

        if (message.guild?.id !== process.env.GUILD_ID) {
            console.log("[FILTER] Message skipped - wrong server");
            return;
        }
        if (message.author.bot) {
            console.log("[FILTER] Message skipped - bot");
            return;
        }
        if (message.reaction.emoji.name !== "✅") {
            console.log("[FILTER] Message skipped - wrong reaction");
            return;
        }
        if (message.channel.id !== process.env.VERIFY_CHANNEL_ID) {
            console.log("[FILTER] Message skipped - wrong channel");
            return;
        }
        console.log("[ACTION] Adding role to user - taking action");
    }
}