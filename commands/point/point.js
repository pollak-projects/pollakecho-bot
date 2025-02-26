const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
    .setName("point")
    .setDescription("Az Admin pontokat adhat a diákoknak")
    .addUserOption(option =>
        option
        .setName("diak")
        .setDescription("A diák, akinek a pontját módosítani szeretnéd")
        .setRequired(true)
    ).addIntegerOption(option =>
        option
        .setName("pont")
        .setDescription("A pont, amit hozzá szeretnél adni vagy elvenni a diáktól")
        .setRequired(true)
    ),

    execute: async (interaction) => {
        const authorId = interaction.user.id;
        const discordId = interaction.options.getUser("diak").id;
        const point = interaction.options.getInteger("pont");
        const apiUrl = `https://api-echo.pollak.info/discord/point`;

        try {
            if (!interaction.memberPermissions?.has("ADMINISTRATOR")) {
                await interaction.reply({
                    content: "Nincs jogosultságod a parancs használatához",
                    flags: MessageFlags.Ephemeral
                });
            }

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ authorId: authorId, discordId: discordId, point: point }),
            });

            if (response.ok) {
                if (point > 0) {
                    await interaction.reply({
                        content: "${point} pont hozzá lett adva a ${discordId} diákhoz",
                        flags: MessageFlags.Ephemeral
                    }
                );
                }else {
                    await interaction.reply({
                        content: "${point} pont le lett vonva a ${discordId} diáktól",
                        flags: MessageFlags.Ephemeral
                    }
                );
                }

            }else {
                throw new Error(`Hiba történt: ${response.statusText}`);
            }

        } catch (error) {
            console.error(error);
            await interaction.reply(
              `Valami Hiba Történt \n${error.message || error}`
            );
          }
    }
}