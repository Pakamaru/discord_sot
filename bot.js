const fs = require('fs');
const Discord = require('discord.js');
const { token, prefix, guildSettings } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.on('ready', () => {
    client.user.setActivity(';help')
        .catch(console.error);
    console.log("Ready to use");
});

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

console.log("Loaded in commands:")
client.commands.forEach(item => item.active ? console.log(item.name) : '');
console.log("---------------------------------");

client.session = {
    startingTime: new Date(),
    queue: []
};

client.on('message', msg => {
    //Check if the prefix is right and if its not a bot
    if(!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(' ');
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if(!command || !command.active) return;

    //Check if the user has the right role
    if(command.role){
        if (!msg.member.guild.roles.cache.some(role => role.name.toLowerCase() === command.role)) return msg.reply("You do not have the right permissions for this command");
    }

    //Check if you put the args right
    if (command.args && !args.length) {
        let reply = (`You didn't provide any arguments, ${msg.author}!`);

        if(command.usage)
            reply += `\nThe proper way to use this command is: \`${prefix}${command.name} ${command.usage}\``;
        return msg.channel.send(reply);
    }

    //Check if the message is in a guild of DM
    if (command.guildOnly && msg.channel.type === 'dm') {
        return msg.reply('I can\'t execute that command inside DMs!');
    }

    try {
        command.execute(msg, args)
    } catch (error) {
        console.log(error);
        msg.channel.send('Something went wrong with that command');
    }
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.channel
    let oldUserChannel = oldMember.channel

    try {
        if(oldUserChannel === null && newUserChannel !== null) {
            // User Joins a voice channel
            if (newUserChannel.id === guildsettings.main.channels.waiting_voice){
                if(client.session.queue.includes(newMember.member.id)) return;
                client.session.queue.push(newMember.member.id);
                updateQueue(newMember.guild);
                newMember.guild.channels.cache.get(guildsettings.main.channels.waiting_chat).send(`<@${newMember.member.id}> you successfully joined the queue`);
            }


        } else if(newUserChannel === null){
            // User leaves a voice channel
            if(oldUserChannel.id === guildsettings.main.channels.waiting_voice)
                newMember.guild.channels.cache.get(guildsettings.main.channels.logs).send(`<@${newMember.member.id}> left the waiting room channel`);
        }

    } catch (e){
        console.log(`Error: ${e}`);
    }
})

function updateQueue(guild){
    let players = '';
    let counter = 0;
    let queueChannel = guild.channels.cache.get(guildsettings.main.channels.queue)
    let messageId = queueChannel.lastMessageID;
    guild.client.session.queue.forEach(userId => {
        counter++;
        players += `\n${counter} - <@${userId}>`;
    })
    guild.client.session.embed.fields = [];
    guild.client.session.embed.addField('Players', players);
    queueChannel.messages.fetch(messageId).then(message => {
        message.edit(guild.client.session.embed).then(sentEmbed => {});
    });
}

client.login(token);