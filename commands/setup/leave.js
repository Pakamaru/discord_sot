const { guildSettings } = require('../../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'leave',
    aliases: ['exit', 'quit'],
    description: 'Removes the user from the queue',
    usage: '',
    role: 'member',
    guildOnly: true,
    active: true,
    execute(msg, args){
        if(!msg.client.session.queue.includes(msg.author.id))
            return msg.reply('You are currently not in the queue');
        msg.client.session.queue.splice(msg.client.session.queue.findIndex(index => index === msg.author.id), 1);
        updateQueue(msg);
        msg.reply('you successfully left the queue');
    }
}

function updateQueue(msg){
    let players = '';
    let counter = 0;
    let queueChannel = msg.guild.channels.cache.get(guildsettings.main.channels.queue)
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