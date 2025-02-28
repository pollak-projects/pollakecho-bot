const fs = require("node:fs");
const path = require("node:path");
const { client } = require("../bot.js");

const eventsPath = path.join(__dirname, "../events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  console.log(`Loading event ${file}`);
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    console.log(`Registering once event ${event.name}, once`);
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    console.log(`Registering event ${event.name}, on`);

    client.on(event.name, (...args) => event.execute(...args));
  }
}
