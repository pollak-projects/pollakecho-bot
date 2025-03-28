const config = require("../config.json");

async function evaluateMsg(message) {
  return 1;
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