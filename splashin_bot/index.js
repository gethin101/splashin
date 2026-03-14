require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const db = require("./firebase");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);

  const stateRef = db.collection("game").doc("state");
  let lastRoundState = null;

  stateRef.onSnapshot(async (snap) => {
    const data = snap.data();
    if (!data) return;

    const channel = client.channels.cache.get("YOUR_CHANNEL_ID_HERE");
    if (!channel) return;

    // First time bot loads: store value but don't announce
    if (lastRoundState === null) {
      lastRoundState = data.roundActive;
      return;
    }

    // Detect change
    if (data.roundActive !== lastRoundState) {
      lastRoundState = data.roundActive;

      if (data.roundActive === true) {
        channel.send(
`============================
A new Splashin round has just started!
============================`
        );
      } else {
        channel.send(
`=====================
The current round just ended
=====================`
        );
      }
    }
  });
});

client.login(process.env.TOKEN);
