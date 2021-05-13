module.exports = {
    name: 'ping',
    description: 'Ping!',
    active: false,
    execute(message, args) {
        message.channel.send('pong.');
    },
};