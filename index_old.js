const { executionAsyncResource } = require('async_hooks');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
const ytdl = require('ytdl-core');
const rhyme = require('rhyme');
const synonyms = require('synonyms');
const tcom = require('thesaurus-dom');
const date = require('date-and-time');
var _ = require('lodash');

/********************************************************************
 * This bot was created for the Discord server of FrenZone
 * 
 * author: tracf(x)
 * 
 * 
 ********************************************************************/

//data
const {
    prefix,
    token,
} = require('./config.json');
const emojiList = require('./emojiList.json');
const cardList = require('./cards.json');
const goodList = require('./goodbotemoticon.json');
const badList = require('./badbot.json');
const memegentemplates = require('./memegentemplates.json');
const reactionMIN = 5;
const reactionMAX = 15;
const sarcasticMIN = 50;
const sarcasticMAX = 100;
const musicQueue = new Map();
var messageCounter = 0;
var reactionCounter = 0;
var sarcasticThreshold = getRandomIntInclusive(sarcasticMIN, sarcasticMAX);
var reactionThreshold = getRandomIntInclusive(reactionMIN, reactionMAX);


client.on("ready", () => {
    console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
    //ignore messages from bot
    if (msg.author.bot) return;




    //activity log
    try {
        console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag} sent a message to ${msg.channel.name}`);
    } catch (e) {
        console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: log failed`);
    }
    //return if not in approved non-serious channels, only during initial building and testing
    if (msg.channel.name === "serious-zone") return;

    // reacts skull emoji on "I forgor"
    if (msg.content.toLowerCase().match(new RegExp("i forgor")) != null) msg.react('????');
    if (msg.content.toLowerCase().match(/i forgot/)) msg.channel.send("I forgor* ????");
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
    if (msg.content.toLowerCase().match(/good *(fren)?bu?o?[tyd]/)) msg.channel.send(_.sample(goodList));
    // react to neg
    if (msg.content.toLowerCase().match(/bad *(fren)?bu?o?[tyd]/)) msg.channel.send(badList[Math.floor(Math.random() * badList.length)]);
    // react to send nudes
    if (msg.content.toLowerCase().match(/send( some|me( some)?)? n(u*|o*)dl?e?s*/)) msg.channel.send("u first :3");
    // react to Linux
    if (msg.content.toLowerCase().match(/linux/)) msg.channel.send("I use Arch btw");
    // 836
    if (msg.content.toLowerCase().match(/what time/)) msg.channel.send("8:36");
    // irc gold standard of the 90s
    if (msg.content.toLowerCase().match(/\ba\/?s\/?l\b/)) msg.channel.send("18/f/cali u?");
    // love uuuuu
    if (msg.content.toLowerCase().match(/i?\s*l[uo]+v+(e+)?\s*(y+)?(o+)?[au]+/)) msg.channel.send("??? L????????????????????? too ( ??? ??? ??? ???)??????");







    messageCounter++;
    reactionCounter++;
    // console.log("Message Counter: " + messageCounter);
    //console.log("Reaction Counter: " + reactionCounter);
    // console.log("Sarcastic Threshold: " + sarcasticThreshold);
    //console.log("Reaction Threshold: " + reactionThreshold);

    //reply with a sarcastic comment
    if (messageCounter >= sarcasticThreshold) {
        try {
            // msg.reply(`${sarcasticComment(msg.content)} ${msg.guild.emojis.cache.find(emoji => emoji.name === "spongebobmock")}`);
            msg.channel.send(`https://memegen.link/spongebob/-/${msg.content.split(' ').join('-')}.png`);
        } catch (e) {
            console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: sarcastic failed`);
        }
        messageCounter = 0;
        sarcasticThreshold = getRandomIntInclusive(sarcasticMIN, sarcasticMAX);
    }

    // greets on mention
    if (msg.mentions.has(client.user.id)) msg.channel.send(`hi :3`);

    //react randomly to a message with custom emoji
    if (reactionCounter === reactionThreshold) {
        try {
            msg.react(msg.guild.emojis.cache.find(emoji => emoji.name === emojiList[Math.floor(Math.random() * emojiList.length)]));
        } catch (e) {
            console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: reaction failed`);
        }
        reactionCounter = 0;
        reactionThreshold = getRandomIntInclusive(reactionMIN, reactionMAX);
    }


    if (!msg.content.startsWith(prefix)) return;
    try {

        // had to remove .toLowerCase() because of case sensitivity in one of the commands
        // probably a better way to do this, than moving it to each comparison
        var msgContents = msg.content.trim().split(' ');


        switch (msgContents[0].toLowerCase()) {
            //test***************************************************************************************************
            case `${prefix}ping`:
                msg.reply("stfu");
                console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                break;

            //fun*****************************************************************************************************
            //music player
            case `${prefix}music`:
                try {
                    const serverQueue = musicQueue.get(msg.guild.id);
                    switch (msgContents[1].toLowerCase()) {
                        case `play`:
                            console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                            execute(msg, serverQueue);
                            msg.delete();
                            break;
                        case `skip`:
                            console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                            skip(msg, serverQueue);
                            break;
                        case `stop`:
                            console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                            stop(msg, serverQueue);
                            break;
                        default:
                            msg.channel.send("invalid command");
                    }
                } catch (e) {
                    console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: music command failed`);
                }
                break;
            //end fun

            //utilities***********************************************************************************************
            //roll a dice, can have parameter for number of sides, default is 6
            // supports number of dice and modifiers use !dice (\\d+d)?\\d+(+\\d+)?)?\
            // TODO CLEANNNN and refactor and test too i guess
            case `${prefix}dice`:
            case `${prefix}roll`:
                var num = 0;
                var arr;
                var num_dice = 1;
                var dice_sides = 6;
                var dice_mod = 0;
                var min;
                var max;
                if (msgContents.length > 1) {
                    // nDn+n
                    if (msgContents[1].toLowerCase().match(/\b(\d+d\d+\+-?\d+)\b/)) {
                        arr = msgContents[1].split(/[d\+]+/);
                        num_dice = parseInt(arr[0]);
                        dice_sides = parseInt(arr[1]);
                        dice_mod = parseInt(arr[2]);
                        min = num_dice + dice_mod;
                        max = (num_dice * dice_sides) + dice_mod;
                        num = getRandomIntInclusive(min, max);
                        // n+n
                    } else if (msgContents[1].toLowerCase().match(/\b(d?\d+\+-?\d+)\b/)) {
                        arr = msgContents[1].split(/[\+]+/);
                        dice_sides = parseInt(arr[0]);
                        dice_mod = parseInt(arr[1]);
                        min = num_dice + dice_mod;
                        max = (num_dice * dice_sides) + dice_mod;
                        num = getRandomIntInclusive(min, max);
                        // nDn
                    } else if (msgContents[1].toLowerCase().match(/\b(\d+d\d+)\b/)) {
                        arr = msgContents[1].split(/[d]+/);
                        num_dice = parseInt(arr[0]);
                        dice_sides = parseInt(arr[1]);
                        min = num_dice + dice_mod;
                        max = (num_dice * dice_sides) + dice_mod;
                        num = getRandomIntInclusive(min, max);
                    } else {
                        num = rollDice(parseInt(msgContents[1]));
                    }
                } else {
                    num = rollDice(dice_sides);
                }
                if (!isNaN(num)) {
                    if (num <= 1) {
                        msg.reply(`You rolled a ${num}, you really fuckin beefed it man`);
                    } else if (num === 69) {
                        msg.reply(`You rolled a ${num}, nice`);
                    } else {
                        msg.reply(`You rolled a ${num}`);
                    }
                    console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                } else {
                    msg.reply('Invalid command: use \"!dice (\\d+d)?\\d+(+\\d+)?)?\"');
                }
                break;

            //lyric tools
            //rhymes
            case `${prefix}rhyme`:
                console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                if (msgContents.length > 1) {
                    rhyme(function (r) {
                        var rhymes = r.rhyme(msgContents[1]).join(' ').toLowerCase();
                        if (rhymes === "") {
                            msg.channel.send("(undefined)");
                            return;
                        }
                        msg.channel.send(rhymes);
                    });
                } else {
                    msg.channel.send("invalid parameter");
                }
                break;
            //synonyms
            case `${prefix}synonym`:
            case `${prefix}synonyms`:
                console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                if (msgContents.length > 1) {
                    try {
                        var nouns = synonyms(msgContents[1], "n").join(' ');
                    } catch (e) {
                        nouns = "(undefined)";
                    }
                    try {
                        var verbs = synonyms(msgContents[1], "v").join(' ');
                    } catch (e) {
                        verbs = "(undefined)";
                    }
                    msg.channel.send(`nouns: ${nouns}\nverbs: ${verbs}`);
                } else {
                    msg.channel.send("needs a parameter");
                }
                break;
            //antonyms ***DOES NOT WORK***
            case `${prefix}antonym`:
                console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                if (msgContents.length > 1) {
                    try {
                        console.log(tcom.search(msgContents[1]).antonyms.join(' '));
                    } catch (e) {
                        console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: antonym failed`);
                    }
                }
                break;
            //calculator
            case `${prefix}calc`:
                console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                if (msgContents.length > 1) {
                    try {
                        contents = msgContents.slice(1).join(' ');
                        var result = eval(contents);
                        msg.channel.send(`${result}`);
                    } catch (e) {
                        msg.channel.send("invalid parameter");
                    }
                } else {
                    msg.channel.send("invalid parameter");
                }
                break;
            //create random hex color
            case `${prefix}color`:
                console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                var color = '#' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase();
                msg.channel.send(`${color}`);
                break;

            //memegen.link
            case `${prefix}memegen`:
            case `${prefix}meme`:
                console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                if (msgContents.length > 1) {
                    if (msgContents[1] === 'help') {
                        msg.channel.send(`${fs.readFileSync('./memegenhelp.txt')}`);
                        break;
                    }
                    if (msgContents[1] === 'templates') {
                        if (msgContents[2] === 'deep') {
                            msg.channel.send("Deep Templates", { files: ["./deep_memegentemplates.txt"] });
                            break;
                        }
                        msg.channel.send("Templates(id=id, name=descriptor)", { files: ["./memegentemplates.txt"] });
                        break;
                    }
                    var meme = msgContents.slice(1).join('/');
                    msg.channel.send(`https://memegen.link/${meme}.png`);
                } else {
                    msg.channel.send("needs a parameter or 'help' for info on style parameters");
                }
                break;





            // end utilities

            //pastas********************************************************************************
            //TODO rework to !pasta <name>
            //message the navy seal copy posta
            case `${prefix}pasta`:
                if (msgContents.length < 2) {
                    msg.channel.send("missing argument");
                    break;
                }
                switch (msgContents[1]) {
                    case `navyseal`:
                        console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                        msg.channel.send(`${fs.readFileSync('./navyseal.txt')}`);
                        break;
                    case `rickandmorty`:
                        console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                        msg.channel.send(`${fs.readFileSync('./rmpasta.txt')}`);
                        break;
                    case `familyguy`:
                        console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                        msg.channel.send(`${fs.readFileSync('./fgpasta.txt')}`);
                        break;
                    case `daddy`:
                        console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                        msg.channel.send(`${fs.readFileSync('./daddypasta.txt')}`);
                        break;
                    case `gnu`:
                    case `linux`:
                        console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                        msg.channel.send(`${fs.readFileSync('./GNULinuxpasta.txt')}`);
                        break;
                }
                break;

            //speak the navy seal copy pasta
            case `${prefix}saysealpasta`:
                msg.channel.send(`${fs.readFileSync('./navyseal.txt')}`, { tts: true });
                break;
            //end pastas

            //meta********************************************************************
            //TODO add meta info
            // list all available commmands
            case `${prefix}commands`:
                console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                msg.channel.send(`${fs.readFileSync('./commands.txt')}`);
                break;
            // send link to source code
            case `${prefix}source`:
                msg.channel.send(`take a look inside me daddy uWu\nhttps://github.com/TracyMichaels/FrenZoneBot\n`, { files: ['./sourcecode.jpg'] }).then(m => { m.suppressEmbeds(true) });
                break;

            // display info about author
            case `${prefix}author`:
                msg.channel.send(`my daddy is @TracyMichaels <3`);
                break;
            //end meta

            //close bot if being too annoying
            case `${prefix}fuckoff`:
                console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: ${msg.member.user.tag}: Executed ${msgContents[0]} command`);
                msg.channel.send("k bye");
                process.exit();
                break;







        }
    } catch (e) {
        console.log(`${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}:: failed to execute ${msgContents[0]}`);
    }
});

// Function called when the "dice" command is issued
function rollDice(num) {
    const sides = num;
    return Math.floor(Math.random() * sides) + 1;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    //The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function sarcasticComment(message) {
    var msgArr = message.toLowerCase().split("");
    for (var i = 0; i < msgArr.length; i++) {
        if (i % 2 == 0) {
            msgArr[i] = msgArr[i].toUpperCase();
        }
    }
    return msgArr.join('');
}

/*************************************************************************************************
* for music player 
**************************************************************************************************/
async function execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }

    const songInfo = await ytdl.getInfo(args[2]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        musicQueue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            musicQueue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} added to the queue!`);
    }
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );

    if (!serverQueue)
        return message.channel.send("There is no song that I could stop!");

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = musicQueue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        musicQueue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Started playing: **${song.title}**`);
}
/**********************************************************************************************
 * end music player
 **********************************************************************************************/

client.login(token);