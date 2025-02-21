const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("om")
    .setDescription("Kapcsold össze a Discord fiókodat a Pollákos fiókoddal")
    .addStringOption((option) =>
      option.setName("omid").setDescription("Az OM azonosító").setRequired(true)
    ),
  execute: async (interaction) => {
    const omId = interaction.options.getString("omid");
    const apiUrl = `https://api-echo.pollak.info/om/${omId}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Hiba történt: ${response.status}`);
      }
      const data = await response.json();

      await interaction.reply({
        content: `Eredmény: ${JSON.stringify(data)}`,
        flags: MessageFlags.EPHEMERAL,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Hiba történt a kérés során.",
        flags: MessageFlags.EPHEMERAL,
      });
    }
  },
};
