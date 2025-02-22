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

    const apiUrl = `https://api-echo.pollak.info/discord/om`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discordId: interaction.user.id,
          om: omId,
        }),
      });
      if (!response.ok) {
        throw new Error(`Hiba történt: ${response.status}`);
      }
      const data = await response.json();

      await interaction.reply({
        content: `Eredmény: ${data}`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Hiba történt a kérés során. \n" + error,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
