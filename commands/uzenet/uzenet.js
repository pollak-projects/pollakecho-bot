const { SlashCommandBuilder } = require('discord.js');

data: new SlashCommandBuilder()
.setName("uzenet")
.setDescription(
  "Továbbít egy üzenetet a tanártól a diákok felé"
)
.addChannelOption((option) =>
  option
    .setName("csatorna")
    .setDescription(
      "A felhasználó megadja a csatornát, amelyen a tanár üzenetét meg szeretné jeleníteni"
    )
    .setRequired(true)
).addStringOption((option) =>
  option
    .setName("oktato")
    .setDescription(
      "A felhasználó megadja a tanár nevét, aki az üzenetet küldi"
    )
    .setRequired(true)
).addStringOption((option) =>
  option
    .setName("uzenet")
    .setDescription(
      "A felhasználó megadja az üzenetet, amelyet a tanár a diákoknak küld"
    )
    .setRequired(true)
),

module.exports = {
    data: data,
    execute: async (interaction) => {
        const channel = interaction.options.getChannel("csatorna");
        const teacher = interaction.options.getString("oktato");
        const message = interaction.options.getString("uzenet");

        const embed = new EmbedBuilder()
        .setTitle(
          `${teacher}`
        )
        .setColor("#0099ff")
        .setTimestamp();

        embed.addFields({
            name: `${message}`,
        });


        await interaction.client.channels.cache.get(channel.id).send({
        embeds: [embed],
      });

      await interaction.reply({
        content: "A legtöbb ponttal rendelkező felhasználók listája elküldve.",
        ephemeral: true,
      });
    },
};