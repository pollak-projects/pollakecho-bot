export async function evaluateMsg(message) {
  console.log("Evaluating message", message.content);
  return 1;
}

export async function addPoints(discordId, points) {
  console.log("Adding points to user", discordId, points);
  const response = await fetch(
    `https://api-echo.pollak.info/discord/user/${discordId}/points`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({ points }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to add points: ${response.statusText}`);
  }
  return await response.json();
}
