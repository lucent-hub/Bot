const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express');
const app = express();
let shouldKick = false;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ]
});

client.on('ready', () => console.log(`Bot online as ${client.user.tag}`));

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content === "!modkick") {
        const embed = new EmbedBuilder()
            .setTitle("⚠️ Moderator Action")
            .setDescription("React with ⚠️ to kick your active mod.")
            .setColor(0xff0000);
        const msg = await message.channel.send({ embeds: [embed] });
        await msg.react("⚠️");
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.emoji.name === "⚠️" && !user.bot) {
        shouldKick = true;
        console.log("Kick triggered from Discord!");
    }
});

// API endpoint for Roblox
app.get('/kick-status', (req, res) => {
    res.json({ kick: shouldKick });
    shouldKick = false;
});

app.listen(3000, () => console.log("API running on port 3000"));
client.login("YOUR_BOT_TOKEN_HERE");
