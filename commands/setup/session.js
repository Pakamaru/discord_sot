const { guildSettings } = require('../../config.json');
const { prefix } = require('../../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'session',
    aliases: ['setup'],
    description: 'Starts a session for finding a server',
    usage: '<start|end>',
    role: 'admin',
    args: true,
    guildOnly: true,
    active: true,
    async execute(msg, args) {
        if (args[0] === "start") {
            msg.client.session = sessionStart();
            let session = msg.client.session;
            msg.client.session.embed = new Discord.MessageEmbed()
                .setColor('#E6A0E6')
                .setTitle('Queue')
                .setAuthor(msg.author.username, msg.author.avatarURL())
                .setDescription(`This is the Alliance queue. Make sure you join this if you would like a spot in the server. You can join the queue by using \`${prefix}join\``)
                .setThumbnail('https://store-images.s-microsoft.com/image/apps.16347.14554784103656548.6c0bfca6-ceff-4368-9bde-2fe50f344136.007dce43-6492-46f2-bb2b-2b28df98fc3c?mode=scale&q=90&h=225&w=150')
            await msg.guild.channels.cache.get(guildSettings.dev.channels.queue).send(msg.client.session.embed);
            msg.client.session.queueId = msg.guild.channels.cache.get(guildSettings.dev.channels.queue).lastMessageID;
            console.log(msg.client.session.queueId);
            msg.channel.send(`Started new session
                \n<@&${guildSettings.dev.roles.member}> Don't forget to tune in at <#${guildSettings.dev.channels.queue}> using the command \`${prefix}join\``);

            // msg.channel.send(`Started new session at: ${session.startingTime.getDate()}-${session.startingTime.getMonth()+1} ${session.startingTime.getHours()}:${session.startingTime.getMinutes()} (CEST)
            // \n<@&${guildSettings.dev.roles.member}> Don't forget to tune in at <#${guildSettings.dev.channels.queue}> using the command \`${prefix}join\``);
        }
    }
}

function sessionStart() {
    return {
        startingTime: new Date(),
        queue: [],
        embed: new Discord.MessageEmbed(),
        searching: true,
        queueId: ""
    };
}