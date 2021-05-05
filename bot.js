const fs = require('fs');
const Discord = require('discord.js');
const { token, prefix, guildSettings } = require('./config.json');
const mod = guildSettings.roles.mod;
const admin = guildSettings.roles.admin;
const owner = guildSettings.roles.owner;

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(';help')
        .then(presence => console.log(`Acivity set to ${presence.activities[0].name}`))
        .catch(console.error);
});

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

client.on('message', msg => {
    if(!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(' ');
    const commandName = args.shift().toLowerCase();

    if(!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    console.log(command.role);
    console.log(msg.member.guild.roles);

    if(command.role){
        if (!msg.member.guild.roles.cache.has(role => role.name === command.role)) return;
    }

    try {
        command.execute(msg, args)
    } catch (error) {
        console.log(error);
        msg.channel.send('Something went wrong with that command');
    }
    console.log(command);
});

client.login(token);