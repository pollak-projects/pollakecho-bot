const { SlashCommandBuilder, MessageFlags } = require("discord.js");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("om")
    .setDescription("Kapcsold össze a Discord fiókodat a Pollákos fiókoddal")
    .addStringOption((option) =>
      option
        .setName("omazonosito")
        .setDescription("Az OM azonosító")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const omId = interaction.options.getString("omazonosito");

    if (omId.length !== 11) {
      await interaction.reply({
        content: "Az OM azonosítónak 11 karakternek kell lennie.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const apiUrl = `https://api-echo.pollak.info/discord/om`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY,
        },
        body: JSON.stringify({
          discordId: interaction.user.id,
          om: omId,
        }),
      });

      switch (response.status) {
        case 200:
          await interaction.reply({
            content: "Sikeresen összekapcsoltad a fiókodat.",
            flags: MessageFlags.Ephemeral,
          });
          break;
        case 400:
          await interaction.reply({
            content: "Az OM azonosító nem megfelelő.",
            flags: MessageFlags.Ephemeral,
          });
          break;
        case 409:
          await interaction.reply({
            content:
              "A Discord fiókod már össze van kapcsolva egy OM azonosítóval.",
            flags: MessageFlags.Ephemeral,
          });
          break;
        default:
          await interaction.reply({
            content: "Hiba történt a kérés során. ",
            flags: MessageFlags.Ephemeral,
          });
          break;
      }
      const data = await response.json();

      console.log("URL: " + apiUrl);

      console.log("Status: " + response.status);
      console.log("StatusText: " + response.statusText);
      console.log("Content: " + response.content);
      console.log("Data: " + data);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Hiba történt a kérés során. ",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
