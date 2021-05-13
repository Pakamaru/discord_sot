const fs = require('fs');

module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    args: true,
    active: false,
    execute(msg, args){
        const commandName = args[0].toLowerCase();
        const command = msg.client.commands.get(commandName)
            || msg.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return msg.channel.send(`There is no command with name or alias \`${commandName}\`, ${msg.author}!`);
        }

        const commandFolders = fs.readdirSync('./commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));
    }
}