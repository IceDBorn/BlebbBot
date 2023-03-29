const TMI = require('tmi.js'); // Npm package for communicating with Twitch

const BOT_NAME = 'BlebbBot';
const TMI_OAUTH = ''; // Get the auth token from https://twitchapps.com/tmi/
const TARGET_CHANNEL = 'nebblebb'; // Twitch channel to send messages to
const MESSAGES_INTERVAL = 600000; // Interval to send promotional messages in milliseconds
const MESSAGES = [
    "Thank you for watching! If you'd like stay up to date with the channel, consider following me on Twitter: https://twitter.com/nebblebb",
    "If you'd like to vote in polls, hang out with me or other members of our little community and be notified whenever I go live, feel free to join our Discord server: https://discord.gg/RA5GuG2k6A",
    "Check out my YouTube channel for stream clips and individual boss fights: https://www.youtube.com/@nebblebb1"
];

const TMI_OPTIONS = {
    identity: {
        username: BOT_NAME,
        password: TMI_OAUTH
    },
    channels: [
        TARGET_CHANNEL
    ]
}

// Create a client
const client = new TMI.client(TMI_OPTIONS);

let messagesCounter = 0;
let messageNumber = 0;
let desiredMessagesNumber = 5;

// Register listeners and connect to the chat
client.on('connected', onConnectedHandler);
client.on('message', onMessageHandler);
client.connect();

// Send a promotional message if the desired number of messages were written in the chat within the messages interval
setInterval(() => {
    if (messagesCounter === desiredMessagesNumber) {
        client.say(TARGET_CHANNEL, MESSAGES[messageNumber]).then(() => {
            console.log(`Promotional message number ${messageNumber + 1} sent`);
            clearMessagesCounter();
            if (messageNumber === 2) {
                messageNumber = 0;
                console.log('Resetting promotional messages...');
            } else {
                messageNumber++;
            }
        });
    } else {
        clearMessagesCounter();
        console.log('The desired number of messages was not written in the chat...');
    }
}, MESSAGES_INTERVAL);

function onConnectedHandler () {
    console.log(`Successfully connected to ${TARGET_CHANNEL}!`);
}

// Manage new messages sent in the chat
function onMessageHandler(target, tags, message, self){
    if (self) return // Ignore messages sent by the bot

    // Count up to the desired number of messages
    if (messagesCounter < desiredMessagesNumber) {
        messagesCounter++;
    }

    // Respond to commands
    switch (message.trim()) {
        case '!commands':
            client.say(TARGET_CHANNEL, `@${tags.username} !twitter !discord !yt !vods !rules !runs !bot`);
            break;
        case '!discord':
            client.say(TARGET_CHANNEL, `@${tags.username} https://discord.gg/RA5GuG2k6A`);
            break;
        case '!rules':
            client.say(TARGET_CHANNEL, `@${tags.username} https://pastebin.com/pivfNuNa`);
            break;
        case '!runs':
            client.say(TARGET_CHANNEL, `@${tags.username} https://pastebin.com/u/nebblebb`);
            break;
        case '!twitter':
            client.say(TARGET_CHANNEL, `@${tags.username} https://twitter.com/nebblebb`);
            break;
        case '!vods':
            client.say(TARGET_CHANNEL, `@${tags.username} https://www.youtube.com/@nebblebbvods`);
            break;
        case '!yt':
            client.say(TARGET_CHANNEL, `@${tags.username} https://www.youtube.com/@nebblebb1`);
            break;
        case '!bot':
            client.say(TARGET_CHANNEL, `@${tags.username} https://github.com/IceDBorn/BlebbBot`);
            break;
    }
}

function clearMessagesCounter() {
    messagesCounter = 0;
}
