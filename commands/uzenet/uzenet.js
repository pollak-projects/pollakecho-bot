const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('uzenet')
    .setDescription('Válaszol az Inputoddal')
    .addStringOption(option =>
        option.setName('input')
            .setDescription('Elküldi az inputot')
            .setRequired(true));

module.exports = {
    data: data,
    execute: async (interaction) => {
        const input = interaction.options.getString('input');
        await interaction.reply(`${input}`);
    },
};