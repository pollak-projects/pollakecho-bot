const { Events } = require("discord.js");
const config = require("../config.json");
const { EmbedBuilder, MessageFlags } = require("discord.js");
const badWords = require("./swear_words.json");
const { evaluateMsg, addPoints } = require("../handler/pointHandler");

function checkMessageAgainstBadWords(messageContent, badWords) {
  const matches = badWords.filter((badWord) =>
    messageContent.includes(badWord.word.toLowerCase())
  );

  return {
    hasMatches: matches.length > 0,
    matches: matches,
  };
}

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

    const result = checkMessageAgainstBadWords(messageContent, badWords);

    if (!result.hasMatches) {
      console.log("[FILTER] Message passed - no bad words & correct channel");
      const point = evaluateMsg(message);
      addPoints(message.author.id, point);
      return;
    }

    console.log("[ACTION] Bad word detected - taking action");

    const maxLevel = Math.max(...result.matches.map((match) => match.level));

    let responseText;
    switch (maxLevel) {
      case 5:
        responseText =
          "Súlyos szabályszegés észlelve! Az üzenet tartalma elfogadhatatlan.";
        message.member.ban({ reason: "Tiltott szavak használata" });
        break;
      case 4:
        responseText =
          "Komoly szabályszegés észlelve! Kérem kerülje ezeknek a kifejezéseknek a használatát. Ezért 1 hétre némítva lettél.";
        message.member.timeout(604800);
        break;
      default:
        responseText =
          "Az üzeneted törölve lett, mert tiltott szavakat tartalmaz... Kérlek ne használd ezeket a kifejezéseket. 1 órára némítva lettél.";
        message.member.timeout(3600);
        break;
    }
    if (config.deleteMessages) {
      message
        .reply({
          content: responseText,
          flags: MessageFlags.Ephemeral,
        })
        .catch((error) => {
          console.error("Failed to send reply:", error);
        });

      message.delete().catch((error) => {
        console.error("Failed to delete message:", error);
      });
    }

    if (config.disabledChanels.includes(message.channel.id)) {
      return;
    }

    const logChannel = message.guild.channels.cache.get(config.logChannelId);
    if (logChannel?.isTextBased()) {
      const embed = new EmbedBuilder()
        .setTitle("Message Violation Detected")
        .setDescription(
          `
                    **User:** ${message.author.tag}
                    **Channel:** <#${message.channel.id}>
                    **Content:** \`${message.content}\`
                    **Severity Level:** ${maxLevel}
                    **Detected Words:** ${result.matches
                      .map((m) => m.word)
                      .join(", ")}
                `
        )
        .setColor("#ff0000")
        .setTimestamp();

      logChannel.send({
        embeds: [embed],
      });
    }
    addPoints(message.author.id, maxLevel * -10);
  },
};
