const { Events } = require("discord.js");
const config = require("../config.json");

module.exports = {
  name: Events.MessageCreate,
  execute(message) {
    if (message.guild?.id !== process.env.GUILD_ID) return;

    if (message.author.bot) return;

    const messageContent = message.content.toLowerCase();

    const hasBadWord = config.badWords.some((badWord) =>
      messageContent.includes(badWord.toLowerCase())
    );

    if (hasBadWord) {
      if (config.deleteMessages) {
        message.reply(
          "Az üzeneted törölve lett, mert tiltott szavakat tartalmaz.",
          {
            ephemeral: true,
          }
        );
        message.delete().catch(console.error);
      }

      const logChannel = message.guild.channels.cache.get(config.logChannelId);
      if (logChannel?.isTextBased()) {
        logChannel
          .send({
            embeds: [
              {
                title: "Message Violation Detected",
                description: `
                            **User:** ${message.author.tag}
                            **Channel:** <#${message.channel.id}>
                            **Content:** \`${message.content}\`
                        `,
                color: "#ff0000",
              },
            ],
          })
          .catch(console.error);
      }
    }
  },
};
