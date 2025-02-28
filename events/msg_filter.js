const { Events } = require("discord.js");
const config = require("../config.json");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  execute(message) {
    console.log("[DEBUG] Processing message:", {
      author: message.author.tag,
      content: message.content,
      guildId: message.guild?.id,
      targetGuildId: process.env.GUILD_ID,
    });
    if (message.guild?.id !== process.env.GUILD_ID) {
      console.log("[FILTER] Message skipped - wrong server");
      return;
    }

    if (message.author.bot) {
      console.log("[FILTER] Message skipped - bot");
      return;
    }

    const messageContent = message.content.toLowerCase();
    console.log("[DEBUG] Checking against bad words:", config.badWords);
    const hasBadWord = config.badWords.some((badWord) => {
      const matches = messageContent.includes(badWord.toLowerCase());
      console.log(
        `[DEBUG] Checking "${badWord}" - ${matches ? "MATCHED" : "no match"}`
      );
      return matches;
    });
    if (hasBadWord) {
      console.log("[ACTION] Bad word detected - taking action");

      if (config.deleteMessages) {
        message.delete().catch((error) => {
          console.error("Failed to delete message:", error);
        });
      }
      // Küldjük a választ két külön lépésben
      message.channel
        .send({
          content: "Az üzeneted törölve lett, mert tiltott szavakat tartalmaz.",
          ephemeral: true,
        })
        .catch((error) => {
          console.error("Failed to send reply:", error);
        });

      const logChannel = message.guild.channels.cache.get(config.logChannelId);
      if (logChannel?.isTextBased()) {
        const embed = new EmbedBuilder()
          .setTitle("Message Violation Detected")
          .setDescription(
            `
                            **User:** ${message.author.tag}
                            **Channel:** <#${message.channel.id}>
                            **Content:** \`${message.content}\`
                        `
          )
          .setColor("#ff0000")
          .setTimestamp();
        logChannel.send({
          embeds: [embed],
        });
      }
    } else {
      console.log("[FILTER] Message passed - no bad words");
    }
  },
};
