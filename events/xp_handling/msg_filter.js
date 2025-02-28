const { client } = require("../../bot");
const SwearWords = require("./swear_words.json");

client.on("message", (message) => {
  if (
    SwearWords.some((word) => message.toString().toLowerCase().includes(word))
  ) {
    message.delete().catch((e) => console.error("Couldn't delete message."));
    message.reply(`Please do not swear.`);
  }
});
