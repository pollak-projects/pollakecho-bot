const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uzenet")
    .setDescription("Továbbít egy üzenetet a tanártól a diákok felé")
    .addChannelOption((option) =>
      option
        .setName("csatorna")
        .setDescription(
          "A felhasználó megadja a csatornát, amelyen a tanár üzenetét meg szeretné jeleníteni"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("oktato")
        .setDescription(
          "A felhasználó megadja a tanár nevét, aki az üzenetet küldi"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("uzenet")
        .setDescription(
          "A felhasználó megadja az üzenetet, amelyet a tanár a diákoknak küld"
        )
        .setRequired(true)
    ),

  execute: async (interaction) => {
    const channel = interaction.options.getChannel("csatorna");
    const teacher = interaction.options.getString("oktato");
    const message = interaction.options.getString("uzenet");
    const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg';

    const embed = new EmbedBuilder()
      .setTitle(`${teacher}`)
      .setColor("#9003fc")
      .setDescription(message)
      .setImage(imageUrl)
      .setTimestamp();

    await interaction.client.channels.cache.get(channel.id).send({
      embeds: [embed],
    });

    await interaction.reply({
      content: "A tanár üzenete elküldve.",
      flags: MessageFlags.Ephemeral,
    });
  },
};
