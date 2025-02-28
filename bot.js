const {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");
const express = require("express");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const app = express();
const port = 3001;

//Szia

app.use(express.json());

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  require("./handler/commandHandler.js");
  require("./handler/eventHandler.js");
});

async function fetchChannelsFromBot() {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  return guild.channels.cache.map((channel) => ({
    id: channel.id,
    name: channel.name,
    type: channel.type,
  }));
}

function buildEmbed(author, content) {
  //check if content has url and or image
  const url = content.match(/(https?:\/\/[^\s]+)/g);
  const image = content.match(/\.(jpeg|jpg|gif|png)$/) ? content : null;
  const description = content.replace(url, "");

  const embed = new EmbedBuilder();

  embed.setTitle(author).setColor("#9003fc");

  if (description) {
    embed.setDescription(description);
  }

  if (url) {
    embed.setURL(url[0]);
  }

  if (image) {
    embed.setImage(image);
  }

  return embed;
}

async function sendMessageThroughBot(channelId, author, content, mention) {
  const channel = client.channels.cache.get(channelId);
  if (!channel) throw new Error("Channel not found");

  try {
    const embed = buildEmbed(author, content);

    await channel
      .send({
        content: mention ? `${mention}` : "",
      })
      .then((msg) => {
        channel.send({
          embeds: [embed],
        });
      });
  } catch (error) {
    console.error(error);
  }
}

app.get("/bot/channels", async (req, res) => {
  try {
    const channels = await fetchChannelsFromBot();
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch channels" });
  }
});

app.post("/bot/message", async (req, res) => {
  const { channel, author, msg, mention } = req.body;

  try {
    await sendMessageThroughBot(channel, author, msg, mention);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});

client.login(process.env.TOKEN);

module.exports = { client };
