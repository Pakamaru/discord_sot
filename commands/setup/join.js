const { guildSettings } = require('../../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'join',
    aliases: ['participate'],
    description: 'Adds the user to the queue',
    usage: '',
    role: 'member',
    guildOnly: true,
    active: true,
    execute(msg, args){
        if(msg.client.session.queue.includes(msg.author.id))
            return msg.reply('You already joined the queue');
        msg.client.session.queue.push(msg.author.id);
        updateQueue(msg);
        msg.reply('you successfully joined the queue');
    }
}

function updateQueue(msg){
    let players = '';
    let counter = 0;
    let queueChannel = msg.guild.channels.cache.get(guildSettings.dev.channels.queue)
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