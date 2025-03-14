const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giverole')
    .setDescription(
        'Rangot ad egy adott felhasználónak'
    )
    .addUserOption(option =>
      option.setName("felhasznalo")
        .setDescription(
            'A Felhasználónak akinek a Rangot adjuk'
        )
        .setRequired(true))
    .addRoleOption(option =>
      option.setName("rang")
        .setDescription(
            'A Rang amit a felhasználónak adunk'
        )
        .setRequired(true)),

  async execute(interaction) {
    const guild = interaction.guild;
    const member = guild.members.cache.get(interaction.options.getUser('user').id);
    const role = interaction.options.getRole('role');

    try {
      await member.roles.add(role);
      await interaction.reply({
        content: "The role ${role.name} has been added to ${member.user.username}.",
        flags: MessageFlags.Ephemeral 
    });

    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error giving the role.',
        flags: MessageFlags.Ephemeral 
    });
    }
  },
};
