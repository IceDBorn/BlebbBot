const TMI = require('tmi.js'); // Npm package for communicating with Twitch

const BOT_NAME = 'BlebbBot';
const TMI_OAUTH = ''; // Get the auth token from https://twitchapps.com/tmi/
const CHANNEL = 'nebblebb'; // Twitch channel to send messages to
const TEN_MINUTES = 600000;
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
        CHANNEL
    ]
}

// Create a client
const client = new TMI.client(TMI_OPTIONS);

let messagesCounter = 0;
let selfCounter = 0;
let desiredMessagesNumber = false;
let messageNumber = 0;

// Register listeners and connect to the chat
client.on('connected', onConnectedHandler);
client.on('message', onMessageHandler);
client.connect();

// Send a promotional message if there were 5 messages written in the chat in the last 10 minutes
setInterval(() => {
    if (messagesCounter === 5) {
        client.say(CHANNEL, MESSAGES[messageNumber]).then(() => {
            console.log(`Sent promotional message number ${messageNumber + 1}`);
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
    }
}, TEN_MINUTES);

function onConnectedHandler () {
    console.log(`Successfully connected to ${CHANNEL}`);
}

// Manage new messages sent in the chat
function onMessageHandler(tags, message, self){
    if (self) return // Ignore messages sent by the bot

    // Count messages
    if (messagesCounter <= 4) {
        messagesCounter++;
        selfCounter++;
    } else if (!desiredMessagesNumber) {
        console.log('The desired number of messages was written in the chat...');
        desiredMessagesNumber = true;
    }

    // Respond to commands
    if (message.trim() === '!commands') {
        client.say(CHANNEL, `@${tags.username} !twitter !discord !yt !vods !rules !runs`);
    } else if (message.trim() === '!discord') {
        client.say(CHANNEL, `@${tags.username} https://discord.gg/RA5GuG2k6A`);
    } else if (message.trim() === '!rules') {
        client.say(CHANNEL, `@${tags.username} https://pastebin.com/pivfNuNa`);
    } else if (message.trim() === '!runs') {
        client.say(CHANNEL, `@${tags.username} https://pastebin.com/u/nebblebb`);
    } else if (message.trim() === '!twitter') {
        client.say(CHANNEL, `@${tags.username} https://twitter.com/nebblebb`);
    } else if (message.trim() === '!vods') {
        client.say(CHANNEL, `@${tags.username} https://www.youtube.com/@nebblebbvods`);
    } else if (message.trim() === '!yt') {
        client.say(CHANNEL, `@${tags.username} https://www.youtube.com/@nebblebb1`);
    }
}

function clearMessagesCounter() {
    messagesCounter = 0;
    desiredMessagesNumber = false;
}
