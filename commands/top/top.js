const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
require("dotenv").config(); // Betöltjük a környezeti változókat

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

    // Ellenőrizzük, hogy van-e API kulcs
    if (!process.env.API_KEY) {
      await interaction.reply({
        content: "Hiányzó API kulcs. Ellenőrizd a környezeti változókat!",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    try {
      // Fetch kérés időtúllépéssel
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 másodperc időtúllépés

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY,
        },
        signal: controller.signal,
      });

      clearTimeout(timeout); // Töröljük az időtúllépést, ha megérkezett a válasz

      // Hibakezelés, ha a válasz nem OK
      if (!response.ok) {
        throw new Error(`Hiba történt: ${response.statusText}`);
      }

      const data = await response.json();
      const embed = new EmbedBuilder()
        .setTitle(
          `${new Date().toLocaleDateString()} - A legtöbb ponttal rendelkező diákok listája`
        )
        .setColor("#9003fc")
        .setTimestamp();

      data.forEach((user, index) => {
        embed.addFields({
          name: `#${index + 1} ${user.name}`,
          value:
            `Pontszám: ${user.point}\n` +
            (user.discordId !== "" ? `<@${user.discordId}>` : ""),
        });
      });

      await interaction.client.channels.cache
        .get(channel.id)
        .send("<@&1343254428698021888>");
      await interaction.client.channels.cache.get(channel.id).send({
        embeds: [embed],
      });

      await interaction.reply({
        content: "A legtöbb ponttal rendelkező felhasználók listája elküldve.",
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `Hiba történt a kérés során. \n${error.message || error}`,
        { ephemeral: true }
      );
    }
  },
};
