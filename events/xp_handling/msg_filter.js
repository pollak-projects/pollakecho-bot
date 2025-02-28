const { client } = require("../../bot");
const SwearWords = require("./swear_words.json");

client.on("message", (message) => {
  const { content } = message;
  const swearWords = SwearWords.words;

  console.log(content);

  if (swearWords.some((word) => content.includes(word))) {
    message.delete();
    message.channel.send(
      `A(z) ${message.author} által küldött üzenetet töröltem, mert tiltott szavakat tartalmazott.`
    );
  }
});
