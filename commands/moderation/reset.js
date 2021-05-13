const token = require('../../config.json');

module.exports = {
    name: 'reset',
    description: 'Resets the bot',
    role: 'admin',
    active: false,
    execute(msg, args) {
        msg.channel.send('Resetting...');
        msg.client.destroy();
        msg.client.login(token);
    },
};