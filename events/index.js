const prefix = require("../config.json").prefix;
const adminRole = require("../config.json").guildSettings.admin.role.id;
module.exports = async (client, message) => {
    if(message.author.bot || message.content.indexOf(prefix) !== 0) return ;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const commandArgs = args.join(' ');
    let role = "default";

    if(message.member.roles.find(r => r.id === adminRole)) role = "admin";

    const cmd = client.commands.get(command);
    if (!cmd) return;

    cmd.run(client, message, args, role);
};