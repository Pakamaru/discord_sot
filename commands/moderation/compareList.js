module.exports = {
    name: 'compare',
    aliases: ['checklist', 'listcheck'],
    description: 'Checks if a message has different users than a voice channel',
    usage: '<message link> <voice channel>',
    role: 'admin',
    args: true,
    guildOnly: true,
    active: true,
    execute(msg, args) {
        let link = args[0].substring(48).split('/');
        let voice = args[1];
        let channelID = link[0];
        let messageID = link[1];
        let voiceChannel = msg.guild.channels.cache.get(voice.substr(2, 18));

        let listChannel = msg.guild.channels.cache.get(channelID);
        let listMessage = null;
        let reply = '', reply2 = '';

        listChannel.messages.fetch(messageID)
            .then(message => {
                listMessage = message.mentions.members;
                let voiceMembers = voiceChannel.members;
                let fakes = [];
                let newcomers = [];
                for (let user_ of listMessage){
                    if (!voiceMembers.find(guildMember => guildMember.user.id === user_[1].id))
                        fakes.push(user_[1]);
                }
                for (let user_ of voiceMembers){
                    if (!listMessage.find(guildMember => guildMember.user.id === user_[1].id))
                        newcomers.push(user_[1]);
                }
                fakes.forEach(function (user){
                    reply += `Cheater: <@${user.id}>`;
                });
                newcomers.forEach(function (user){
                    reply2 += `Don't forget to $join <@${user.id}>`;
                });
                msg.channel.send(reply);
                msg.channel.send(reply2);
            });
    },
};