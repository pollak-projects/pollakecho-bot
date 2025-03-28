const { Events, InteractionType } = require("discord.js");
const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

// Import role utilities
const { giveRoleBasedOnDictionarys } = require("../utils/roleUtils");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    // Handle button click for verification
    if (
      interaction.isButton() &&
      interaction.customId === "verification-button"
    ) {
      const modal = new ModalBuilder()
        .setCustomId("verification-modal")
        .setTitle("Azonosítás");

      const omInput = new TextInputBuilder()
        .setCustomId("om-input")
        .setLabel("OM Azonosító")
        .setStyle(TextInputStyle.Short)
        .setMinLength(11)
        .setMaxLength(11)
        .setRequired(true);

      const actionRow = new ActionRowBuilder().addComponents(omInput);
      modal.addComponents(actionRow);

      await interaction.showModal(modal);
      return;
    }

    // Handle modal submission
    if (
      interaction.type === InteractionType.ModalSubmit &&
      interaction.customId === "verification-modal"
    ) {
      const omId = interaction.fields.getTextInputValue("om-input");

      if (omId.length !== 11) {
        await interaction.reply({
          content: "Az OM azonosítónak pontosan 11 karakternek kell lennie.",
          ephemeral: true,
        });
        return;
      }

      try {
        // First acknowledge the modal submission to close it properly
        await interaction.deferReply({ ephemeral: true });

        console.log(
          `OM azonosítás feldolgozása a következő felhasználóhoz: ${interaction.user.tag}`
        );

        const apiUrl = "https://api-echo.pollak.info/discord/om";
        console.log(`API kérés elküldve: ${apiUrl}`);

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

        console.log(`API válasz státusz: ${response.status}`);

        // Check for error responses first (non-200 status codes)
        if (response.status !== 200) {
          const errorText = await response.text();
          console.error(`API hiba: ${errorText}`);

          if (response.status === 400) {
            await interaction.editReply({
              content: "Az OM azonosító nem megfelelő.",
            });
          } else if (response.status === 409) {
            await interaction.editReply({
              content:
                "A Discord fiókod már össze van kapcsolva egy OM azonosítóval.",
            });
          } else {
            await interaction.editReply({
              content: "Hiba történt a kérés során.",
            });
          }
          return;
        }

        // Continue with successful response (status code 200)
        const data = await response.json();
        console.log("API válasz adat:", data);

        // Add base student role
        const member = interaction.guild.members.cache.get(interaction.user.id);
        await member.roles.add("1336623792797257739");

        // Add specific roles based on student data
        await giveRoleBasedOnDictionarys(interaction, data.content);

        // Set nickname based on student data
        const nickname = `${data.content.vezeteknev} ${data.content.utonev}`;
        await member.setNickname(nickname);

        // After all operations complete, update the deferred reply with success message
        await interaction.editReply({
          content: "Sikeresen összekapcsoltad a fiókodat.",
        });
      } catch (error) {
        console.error("Azonosítási hiba:", error);
        if (interaction.deferred) {
          await interaction.editReply({
            content: `Hiba történt a kérés során: ${error.message}`,
          });
        } else {
          await interaction.reply({
            content: `Hiba történt a kérés során: ${error.message}`,
            ephemeral: true,
          });
        }
      }
    }
  },
};
