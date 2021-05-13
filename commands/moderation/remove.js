const { guildSettings } = require('../../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'remove',
    aliases: ['kick'],
    description: 'Removes a user from the queue',
    usage: '',
    role: 'admin',
    guildOnly: true,
    active: true,
    execute(msg, args){
        let kickedUserNumber = msg.client.session.queue[args[0]-1];
        if(!kickedUserNumber)
            return msg.reply('Nobody has this spot');
        msg.client.session.queue.splice(msg.client.session.queue.findIndex(index => index === kickedUserNumber), 1);
        updateQueue(msg);
        msg.channel.send(`<@${kickedUserNumber}> successfully kicked from the queue`);
    }
}

function updateQueue(msg){
    let players = '';
    let counter = 0;
    let queueChannel = msg.guild.channels.cache.get(guildSettings.channels.queue)
    let messageId = queueChannel.lastMessageID;
    msg.client.session.queue.forEach(userId => {
        counter++;
        players += `\n${counter} - <@${userId}>`;
    })
    msg.client.session.embed.fields = [];
    if(players !== '')
        msg.client.session.embed.addField('Players', players);
    queueChannel.messages.fetch(messageId).then(message => {
        message.edit(msg.client.session.embed).then(sentEmbed => {});
    });
}