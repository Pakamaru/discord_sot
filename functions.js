const { guildSettings } = require('./config.json');
const Discord = require('discord.js');

export function updateQueue(msg){
    let players = '';
    let counter = 0;
    let queueChannel = msg.guild.channels.cache.get(guildSettings.channels.queue)
    let messageId = queueChannel.lastMessageID;
    msg.client.session.queue.forEach(userId => {
        counter++;
        players += `\n${counter} - <@${userId}>`;
    })
    msg.client.session.embed.fields = [];
    msg.client.session.embed.addField('Players', players);
    queueChannel.messages.fetch(messageId).then(message => {
        message.edit(msg.client.session.embed).then(sentEmbed => {});
    });
}