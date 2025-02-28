const msg =
  "aalsdlas askAAAalés fasz ajsAAAAbjas aLKSJDFLKAnajsdasjf ksdjfkashfuida geci ";
const { client } = require("../../bot");
const swear = require("./swear_words.json");

// swear.forEach(word => {
//     if (msg.includes(word)) {
//         console.log(">:O\n PURPLE 😂😁😀")
//     }
// })

client.on("messageCreate", async (message) => {
  swear.forEach((word) => {
    if (message.content.includes(word)) {
      console.log(">:O\n PURPLE 😂😁😀");
      //send message to the user that they used a bad word , ephemeral then delete the message
      message.reply({
        content: "Nem szép dolog ilyen szavakat használni!",
        ephemeral: true,
      });
      message.delete();
    }
  });
});
