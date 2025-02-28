const { Events } = require("discord.js");
const SwearWords = require("./swear_words.json");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  execute: async (message) => {
    if (message.author.bot) return;
    if (message.content === "ping") {
      message.reply("pong");
    }
    if (
      SwearWords.some((word) => message.content.toLowerCase().includes(word))
    ) {
      message.delete();
      message.reply("Nem szabad káromkodni!", { ephemeral: true });
    }
  },
};
