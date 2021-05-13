let prefix = require('../../config.json');

module.exports = {
    name: 'prefix',
    description: 'Changes the prefix',
    usage: '<new prefix>',
    role: 'admin',
    args: true,
    guildOnly: true,
    active: false,
    execute(message, args) {
        prefix = args;
        message.channel.send(`Successfully changed prefix to ${args}`);
    },
};