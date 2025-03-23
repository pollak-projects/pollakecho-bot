const { SlashCommandBuilder, MessageFlags } = require("discord.js");
require("dotenv").config();

const szakmaDictionary = {
  "71b9c9c6-71e0-4bc1-8375-8f586608a869": "1347466691017183262",
};

const agazatDictionary = {
  "7278f3ab-b9a4-40f2-a794-e51cee8487f9": "1347466691017183262",
};

const evfolyamDictionary = {
  9: "1336625642585849876",
  10: "1336625853076865024",
  11: "1336625881929482321",
  12: "1336625977073205279",
  13: "1336625996132126741",
};

const giveRoleBasedOnDictionarys = async (interaction, data) => {
  /*
  vezeteknev: 'Teszt',
  keresztnev: 'Elek',
  "evfolyam": "12",
     "agazat": {
        "name": "Elektronika és elektrotechnika - 04 (2020)",
        "id": "7278f3ab-b9a4-40f2-a794-e51cee8487f9"
    },
    "szakma": {
        "name": "Erősáramú elektrotechnikus - 5 0713 04 04 (2020)",
        "id": "71b9c9c6-71e0-4bc1-8375-8f586608a869"
    },
  */

  /*check if szakma is empty, if not, give role based on szakma, if empty, give role based on agazat. Add the evfolyam also as a role.*/
  const member = interaction.guild.members.cache.get(interaction.user.id);

  try {
    if (data.szakma && data.szakma.id && szakmaDictionary[data.szakma.id]) {
      await member.roles.add(szakmaDictionary[data.szakma.id]);
    } else if (
      data.agazat &&
      data.agazat.id &&
      agazatDictionary[data.agazat.id]
    ) {
      await member.roles.add(agazatDictionary[data.agazat.id]);
    }

    // Convert evfolyam to a number to match dictionary keys
    const evfolyamNum = parseInt(data.evfolyam, 10);
    if (evfolyamDictionary[evfolyamNum]) {
      await member.roles.add(evfolyamDictionary[evfolyamNum]);
    }
  } catch (error) {
    console.error("Error adding roles:", error);
    // Handle error or rethrow if needed
  }
};

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
          "x-api-key": process.env.API_KEY,
        },
        body: JSON.stringify({
          discordId: interaction.user.id,
          om: omId,
        }),
      });
      const data = await response.json();
      console.log(data);

      switch (response.status) {
        case 200:
          await interaction.reply({
            content: "Sikeresen összekapcsoltad a fiókodat.",
            flags: MessageFlags.Ephemeral,
          });

          await giveRoleBasedOnDictionarys(interaction, data.content);

          await interaction.guild.members.cache
            .get(interaction.user.id)
            .setNickname(
              data.content.vezeteknev + " " + data.content.keresztnev
            );

          break;
        case 400:
          await interaction.reply({
            content: "Az OM azonosító nem megfelelő.",
            flags: MessageFlags.Ephemeral,
          });
          break;
        case 409:
          await interaction.reply({
            content:
              "A Discord fiókod már össze van kapcsolva egy OM azonosítóval.",
            flags: MessageFlags.Ephemeral,
          });
          break;
        default:
          await interaction.reply({
            content: "Hiba történt a kérés során. ",
            flags: MessageFlags.Ephemeral,
          });
          break;
      }

      console.log("URL: " + apiUrl);

      console.log("Status: " + response.status);
      console.log("StatusText: " + response.statusText);
      console.log("Content: " + response.content);
      console.log("Data");
      console.log(data);
      console.log(data.content);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Hiba történt a kérés során. ",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
