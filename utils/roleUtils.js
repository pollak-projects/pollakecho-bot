// Role dictionaries
const szakmaDictionary = {
  "eeecd4ab-5a1a-4a1e-a8ef-28408c3df97a": "1353379465622978580",
  "b1a33d92-c5ce-4f2a-abad-e8a55c3fc849": "1347466557554692096",
  "71b9c9c6-71e0-4bc1-8375-8f586608a869": "1347466691017183262",
  "67b1f569-3d26-41b5-8563-75a556d0e2c9": "1347466849184387153",
  "52879ae6-16a5-4ca9-b8c7-a366f5607000": "1347466755991273523",
};

const agazatDictionary = {
  "7278f3ab-b9a4-40f2-a794-e51cee8487f9": "1347466691017183262",
  "8f592440-5a10-4eb6-9465-066c2f14815b": "1347466849184387153",
};

const evfolyamDictionary = {
  9: "1336625642585849876",
  10: "1336625853076865024",
  11: "1336625881929482321",
  12: "1336625977073205279",
  13: "1336625996132126741",
  "1/13": "1336625996132126741",
};

// Role management function
const giveRoleBasedOnDictionarys = async (interaction, data) => {
  const member = interaction.guild.members.cache.get(interaction.user.id);
  try {
    if (data.szakma && data.szakma.id && szakmaDictionary[data.szakma.id]) {
      await member.roles.add(szakmaDictionary[data.szakma.id]);
      console.log(`Added szakma role for ${interaction.user.tag}`);
    } else if (
      data.agazat &&
      data.agazat.id &&
      agazatDictionary[data.agazat.id]
    ) {
      await member.roles.add(agazatDictionary[data.agazat.id]);
      console.log(`Added agazat role for ${interaction.user.tag}`);
    }

    // Handle both string formats that might come from API
    let evfolyamNum;
    if (data.evfolyam === "1/13") {
      evfolyamNum = "1/13";
    } else {
      evfolyamNum = parseInt(data.evfolyam, 10);
    }

    if (evfolyamDictionary[evfolyamNum]) {
      await member.roles.add(evfolyamDictionary[evfolyamNum]);
      console.log(`Added evfolyam role for ${interaction.user.tag}`);
    }
  } catch (error) {
    console.error("Error adding roles:", error);
    throw error;
  }
};

module.exports = {
  szakmaDictionary,
  agazatDictionary,
  evfolyamDictionary,
  giveRoleBasedOnDictionarys,
};
