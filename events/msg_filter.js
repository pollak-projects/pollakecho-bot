const { Events } = require("discord.js");
const config = require("../config.json");
const { EmbedBuilder, MessageFlags } = require("discord.js");
const badWords = require("./swear_words.json");
const { evaluateMsg, addPoints } = require("../handler/pointHandler");

function checkMessageAgainstBadWords(messageContent, badWords) {
  const matches = badWords.filter((word) => {
    const regex = new RegExp(`\\b${word.word}\\b`, "i");
    return regex.test(messageContent);
  });

  return {
    hasMatches: matches.length > 0,
    matches: matches,
  };
}

async function timeoutUser(member, time) {
  //timeout if user doesnt have x role
  try {
    await member.timeout(time);
  } catch (error) {
    console.error("Failed to timeout user:", error);
  }
}

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
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

    let deleteMessage = false;

    switch (maxLevel) {
      case 5:
        responseText =
          "Súlyos szabályszegés észlelve! Az üzenet tartalma elfogadhatatlan. 500 pontot levontam a pontjaidból és kitiltottalak a szerverről. ";
        addPoints(message.author.id, -500);
        try {
          message.member.ban({ reason: "Tiltott szavak használata" });
        } catch (error) {
          console.error("Failed to ban user:", error);
        }

        deleteMessage = true;
        break;
      case 4:
        responseText =
          "Komoly szabályszegés észlelve! Kérem kerülje ezeknek a kifejezéseknek a használatát. Ezért 3 napra némítva lettél. 75 pontot levontam a pontjaidból.";
        await timeoutUser(message.member, 60 * 60 * 24 * 3 * 1000);
        addPoints(message.author.id, -75);
        deleteMessage = true;
        break;
      case 3:
        responseText =
          "Az ilyen kifejezések használata nem megengedett. Kérem kerülje ezeknek a kifejezéseknek a használatát. Egy órára némítva lettél. 50 pontot levontam a pontjaidból.";
        await timeoutUser(message.member, 60 * 60 * 1000);
        addPoints(message.author.id, -50);
        deleteMessage = true;
        break;
      case 2:
        responseText =
          "Figyelmeztetés! Kérem kerülje ezeknek a kifejezéseknek a használatát. 10 pontot levontam a pontjaidból.";
        addPoints(message.author.id, -10);
        deleteMessage = false;
        break;
      default:
        responseText =
          "Óvatosan! Az ilyen csúnya szavak használata valakit könnyen megsértethet.";
        deleteMessage = false;
        break;
    }
    if (deleteMessage) {
      await message.author.send(responseText).catch((error) => {
        console.error("Failed to send reply:", error);
      });

      await message.delete().catch((error) => {
        console.error("Failed to delete message:", error);
      });
    } else {
      await message
        .reply(responseText, { flags: MessageFlags.Ephemeral })
        .catch((error) => {
          console.error("Failed to send reply:", error);
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
  },
};
