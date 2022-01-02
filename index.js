const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
var _ = require('lodash');

const client = new Client({
    intents:
        [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        ]
});

// data
const sarcasticMIN = 50;
const sarcasticMAX = 100;
const reactionMIN = 5;
const reactionMAX = 15;
var messageCounter = 0;
var reactionCounter = 0;
//random number between sarcasticMIN and sarcasticMAX
var sarcasticThreshold = Math.floor(Math.random() * (sarcasticMAX - sarcasticMIN + 1) + sarcasticMIN);
//random number between reactionMIN and reactionMAX
var reactionThreshold = Math.floor(Math.random() * (reactionMAX - reactionMIN + 1) + reactionMIN);

// get commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}


// bot ready
client.on('ready', () => {
    console.log('Bot online!');
});


// on message
client.on('messageCreate', async msg => {
    // ignore bot messages and serious zone
    if (msg.author.bot) return;
    if (msg.channel.name === "serious-zone") return;

    // greets on mention
    if (msg.mentions.has(client.user.id)) msg.channel.send(`hi :3`);

    // reacts skull emoji on "I forgor"
    if (msg.content.toLowerCase().match(/i forgor/)) msg.react('💀');
    if (msg.content.toLowerCase().match(/i forgot/)) msg.channel.send("I forgor* 💀");
    // reaccts angry if someone says they/jake is allergic
    if (msg.content.toLowerCase().match(/(i[' a]*m|jake['s]*( is)?) allergic/) != null) msg.react(msg.guild.emojis.cache.find(emoji => emoji.name === "angery"));
    // reacts nicecock emoji to penis/benis
    if (msg.content.toLowerCase().match(/(p|b)enis|\bpp\b|cock/)) msg.react(msg.guild.emojis.cache.find(emoji => emoji.name === "NiceCock"));
    // xkcd hyphen
    if (msg.content.toLowerCase().match(/\w+\d*-ass \w+\d*/)) msg.reply(`What's an ass-${msg.content.toLowerCase().match(/\w+-ass \w+/)[0].split(' ')[1]}?`);
    // reacts obama prism animated emoji on "obama"
    if (msg.content.toLowerCase().match(/obama/)) msg.react(msg.guild.emojis.cache.find(emoji => emoji.name === "ObamaPrismgif"));
    // react to praise
    // if (msg.content.toLowerCase().match(/good (fren)?bo[ty]/)) msg.channel.send(goodList[Math.floor(Math.random() * goodList.length)]);
    //if (msg.content.toLowerCase().match(/good *(fren)?bu?o?[tyd]/)) msg.channel.send(_.sample(goodList));
    // react to neg
    //if (msg.content.toLowerCase().match(/bad *(fren)?bu?o?[tyd]/)) msg.channel.send(badList[Math.floor(Math.random() * badList.length)]);
    // react to send nudes
    if (msg.content.toLowerCase().match(/send( some|me( some)?)? n(u*|o*)dl?e?s*/)) msg.channel.send("u first :3");
    // react to Linux
    if (msg.content.toLowerCase().match(/linux/)) msg.channel.send("I use Arch btw");
    // 836
    if (msg.content.toLowerCase().match(/what time/)) msg.channel.send("8:36");
    // irc gold standard of the 90s
    if (msg.content.toLowerCase().match(/\ba\/?s\/?l\b/)) msg.channel.send("18/f/cali u?");
    // love uuuuu
    if (msg.content.toLowerCase().match(/i?\s*l[uo]+v+(e+)?\s*(y+)?(o+)?[au]+/)) msg.channel.send("Ｉ Lᵒᵛᵉᵧₒᵤ♡ too ( ๑ ᴖ ᴈ ᴖ)～♡");
    // unflip table 
    if (msg.content.match(/\(╯°□°\）╯︵ ┻━┻/)) msg.channel.send("┬─┬ ノ( ゜-゜ノ) bruh, chill ");
    // responds to 69
    if (msg.content.match(/69/)) msg.channel.send("nice");
    // responds to 420
    if (msg.content.match(/420/)) msg.channel.send("BLAZE IT");

    messageCounter++;
    reactionCounter++;
    // reply with sarcastic message
    if (messageCounter >= sarcasticThreshold) {
        try {
            msg.channel.send(`https://memegen.link/spongebob/-/${msg.content.split(' ').join('-')}.jpg`);
        } catch (err) {
            console.log(err);
        }
        messageCounter = 0;
        sarcasticThreshold = Math.floor(Math.random() * (100 - sarcasticMIN + 1) + sarcasticMIN);
    }

    // react with random custom emoji
    if (reactionCounter >= reactionThreshold) {
        try {
            msg.react(_.sample(msg.guild.emojis.cache.map((e) => {
                return `${e} **-** \`:${e.name}:\``;
            })));
        } catch (err) {
            console.log(err);
        }
        reactionCounter = 0;
        reactionThreshold = Math.floor(Math.random() * (reactionMAX - reactionMIN + 1) + reactionMIN);
    }

});


// command handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        return interaction.editReply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }
});

client.login(token);