const {
  SlashCommandBuilder,
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  Events,
  GatewayIntentBits,
  InteractionType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
require("dotenv").config();

// Import role utilities
const { giveRoleBasedOnDictionarys } = require("../../utils/roleUtils");

// Create client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

// Modal verification system
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.content.startsWith("/")) return;

  const buttonRow = new ActionRowBuilder();
  buttonRow.addComponents(
    new ButtonBuilder()
      .setCustomId("verification-button")
      .setLabel("Azonosítás")
      .setStyle(ButtonStyle.Primary)
  );

  await message.reply({
    content: "Kattints a gombra az azonosítási folyamat megkezdéséhez",
    components: [buttonRow],
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "verification-button") {
    const modal = new ModalBuilder()
      .setCustomId("verification-modal")
      .setTitle("Azonosítás");

    const omInput = new TextInputBuilder()
      .setCustomId("om-input")
      .setLabel("OM Azonosító")
      .setStyle(TextInputStyle.Short)
      .setMinLength(11)
      .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(omInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
  }

  if (interaction.type === InteractionType.ModalSubmit) {
    if (interaction.customId === "verification-modal") {
      const omId = interaction.fields.getTextInputValue("om-input");

      if (omId.length !== 11) {
        await interaction.reply({
          content: "Az OM azonosítónak pontosan 11 karakternek kell lennie.",
          ephemeral: true,
        });
        return;
      }

      try {
        const response = await fetch(
          "https://api-echo.pollak.info/discord/om",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.API_KEY,
            },
            body: JSON.stringify({
              discordId: interaction.user.id,
              om: omId,
            }),
          }
        );

        const data = await response.json();

        switch (response.status) {
          case 200:
            await interaction.reply({
              content: "Sikeresen összekapcsoltad a fiókodat.",
              ephemeral: true,
            });

            await giveRoleBasedOnDictionarys(interaction, data.content);

            const member = interaction.guild.members.cache.get(
              interaction.user.id
            );
            await member.roles.add("1336623792797257739");

            const nickname = `${data.content.vezeteknev} ${data.content.utonev}`;
            await member.setNickname(nickname);

            break;
          case 400:
            await interaction.reply({
              content: "Az OM azonosító nem megfelelő.",
              ephemeral: true,
            });
            break;
          case 409:
            await interaction.reply({
              content:
                "A Discord fiókod már össze van kapcsolva egy OM azonosítóval.",
              ephemeral: true,
            });
            break;
          default:
            await interaction.reply({
              content: "Hiba történt a kérés során.",
              ephemeral: true,
            });
            break;
        }
      } catch (error) {
        console.error("Verification error:", error);
        await interaction.reply({
          content: "Hiba történt a kérés során.",
          ephemeral: true,
        });
      }
    }
  }
});

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
