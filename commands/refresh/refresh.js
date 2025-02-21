const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

// Debug: Log environment variables
console.log("Client ID:", clientId);
console.log("Guild ID:", guildId);
console.log("Token:", token ? "Present" : "Missing");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("refresh")
    .setDescription("Reload all bot commands (Admin only)"),
  async execute(interaction) {
    // Check if the user has ADMINISTRATOR permissions
    if (!interaction.memberPermissions?.has("ADMINISTRATOR")) {
      return interaction.reply({
        content: "You do not have permission to use this command.",
        flags: MessageFlags.EPHEMERAL,
      });
    }

    const commands = [];
    const commandsPath = path.join(__dirname, ".."); // Go up one level to the "commands" folder
    const commandFolders = fs.readdirSync(commandsPath);

    // Debug: Log command folders found
    console.log("Command folders found:", commandFolders);

    for (const folder of commandFolders) {
      const folderPath = path.join(commandsPath, folder);
      const commandFiles = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".js")); // Removed the exclusion of refresh.js

      // Debug: Log command files found in each folder
      console.log(`Command files in ${folder}:`, commandFiles);

      for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        delete require.cache[require.resolve(filePath)];
        const command = require(filePath);

        // Debug: Log command being loaded
        console.log(`Loading command from ${filePath}:`, command);

        if (command.data && typeof command.data.toJSON === "function") {
          commands.push(command.data.toJSON());
        } else {
          console.log(
            `[WARNING] The command at ${filePath} does not have a valid "data" property.`
          );
        }
      }
    }

    // Debug: Log commands to register
    console.log("Commands to register:", commands);

    const rest = new REST({ version: "9" }).setToken(token);
    try {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });
      await interaction.reply({
        content: "Commands refreshed successfully!",
        flags: MessageFlags.EPHEMERAL,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Error while refreshing commands!",
        flags: MessageFlags.EPHEMERAL,
      });
    }
  },
};
