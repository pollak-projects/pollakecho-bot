// events/basicRoleAdder.js
const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageReactionAdd,
    once: false,
    execute: async (client, reaction, user) => {
        // Check if reaction is partial (for uncached messages)
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Error fetching reaction:', error);
                return;
            }
        }

        // Configuration
        const CHANNEL_ID = "1024786235618766878";
        const ROLE_IDS = "1336623792797257739";
        const EMOJI = "✅"; 

        // Check if the reaction is in the specified channel
        if (reaction.message.channel.id !== CHANNEL_ID) return;


        //DEBUG:
        console.log("[DEBUG] Processing reaction:", {
            user: user.tag,
            emoji: reaction.emoji.name,
            guildId: reaction.message.guild?.id,
        });

        // Prevent bot from reacting to its own reactions
        if (user.bot) return;

        // Check if the reaction matches our target emoji
        if (reaction.emoji.name !== EMOJI) return;

        // Get the guild and role
        const guild = reaction.message.guild;
        const role= guild.roles.cache.get(ROLE_IDS);

        if (!role) {
            console.error(`Role with ID ${ROLE_IDS} not found.`);
            return;
        }

        // Add the role to the user
        try {
            await reaction.message.guild.members.cache
                .get(user.id)
                .roles.add(role);
            
            console.log(`Added ${role.name} to ${user.tag}`);
        } catch (error) {
            console.error('Error adding role:', error);
        }
    }
};