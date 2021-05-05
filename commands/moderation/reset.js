const token = require('../../config.json');

module.exports = {
    name: 'reset',
    description: 'Resets the bot',
    role: 'admin',
    execute(message, args) {
        message.channel.send('Resetting...')
            .then(msg => client.destroy())
            .then(() => client.login(token));
    },
};