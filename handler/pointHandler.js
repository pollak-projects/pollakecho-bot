const config = require("../config.json");

async function evaluateMsg(message) {
  console.log("Evaluating message", message.content);
  const splitted_message = Array.from(await message.content.trim().split(" "));
  const word_count = splitted_message.length;

  const min_xp = config.pointSettings.minimumXP;
  const plus_xp = config.pointSettings.pluszXP;
  
  let xp = min_xp;

  switch(word_count) {
    case 1:
      xp + min_xp
      console.log("Egy szó")
      break;
    case 2:
      xp + min_xp + plus_xp 
      console.log("Kettő szó")
      break;
  }

  console.log(xp);
  console.log(word_count);
  return word_count;
}

async function addPoints(discordId, points) {
  try{
  console.log("Adding points to user", discordId, points);
  const response = await fetch(
    //"x-api-key"
    `https://api-echo.pollak.info/discord/user/points/${discordId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY,
      },
      body: JSON.stringify({ points }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to add points: ${response.statusText}`);
  }
  return await response.json();
}
catch(error){
  console.log(error)
}
}

module.exports = {evaluateMsg, addPoints}