const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('uzenet')
    .setDescription('Replies with your input!')
    .addStringOption(option =>
        option.setName('input')
            .setDescription('The input to echo back')
            .setRequired(true));

module.exports = {
    data: data,
    execute: async (interaction) => {
        const input = interaction.options.getString('input');
        await interaction.reply(`You said: ${input}`);
    },
};