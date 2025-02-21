const { SlashCommandBuilder, MessageFlags } = require("discord.js");

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

    const apiUrl = `https://api-echo.pollak.info/om/${omId}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Hiba történt: ${response.status}`);
      }
      const data = await response.json();

      await interaction.reply({
        content: `Eredmény: ${JSON.stringify(data)}`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Hiba történt a kérés során.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
