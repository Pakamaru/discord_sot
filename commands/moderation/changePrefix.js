let prefix = require('../../config.json');

module.exports = {
    name: 'prefix',
    description: 'Changes the prefix',
    role: 'admin',
    execute(message, args) {
        prefix = args;
        message.channel.send(`Successfully changed prefix to ${args}`);
    },
};