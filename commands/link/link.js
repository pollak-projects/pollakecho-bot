const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-verification-message")
    .setDescription("Azonosítási üzenet létrehozása")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("A csatorna, ahová az üzenetet küldeni kell")
        .setRequired(false)
    ),
  execute: async (interaction) => {
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;

    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("verification-button")
        .setLabel("Ellenőrzés")
        .setStyle(ButtonStyle.Primary)
    );

    await channel.send({
      content: "Kattints a gombra az azonosítási folyamat megkezdéséhez",
      components: [buttonRow],
    });

    await interaction.reply({
      content: "Az azonosítási üzenet sikeresen létrehozva!",
      ephemeral: true,
    });
  },
};
