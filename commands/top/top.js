const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top")
    .setDescription(
      "Listázza a legtöbb ponttal rendelkező felhasználókat egy adott csatornán"
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "A csatorna, amelyen a felhasználók pontjait meg szeretnéd jeleníteni"
        )
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const channel = interaction.options.getChannel("channel");
    const apiUrl = `https://api-echo.pollak.info/discord/top`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Hiba történt: ${response.statusText}`);
      }
      const data = await response.json();
      const embed = new EmbedBuilder()
        .setTitle(`Top 10 felhasználó a(z) ${channel.name} csatornán`)
        .setColor("#0099ff")
        .setTimestamp();

      data.forEach((user, index) => {
        embed.addFields({
          name: `#${index + 1} ${user.name} <@${user.discordId}>`,
          value: `Pontszám: ${user.point}`,
        });
      });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `Hiba történt a kérés során. \n${error.message || error}`
      );
    }
  },
};
