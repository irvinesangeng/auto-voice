const {Client} = require("discord.js");
const {categoryID, voiceID} = require('./config.json');

client = new Client();
client.login(process.env.token);
client.on("ready", () => {
    console.info(`${client.user.username} is now online`);
    client.user.setActivity(`BILIT TV`, {type: "WATCHING"});
});

client.on('voiceStateUpdate', (Old, New) => {
    if(New.user.bot) return;
    if(Old.user.bot) return;

    if(New.voiceChannelID == voiceID) {
        New.guild.createChannel(`${New.user.username}'s room`, {type: "voice", parent: categoryID})
            .then((set) => {
                set.overwritePermissions(New.user, {"MANAGE_CHANNELS": true, "MANAGE_ROLES_OR_PERMISSIONS": true, "PRIORITY_SPEAKER": true, "MOVE_MEMBERS": true});
            
                return New.setVoiceChannel(New.guild.channels.get(set.id));
            });
    }

    if(Old.voiceChannel) {
        let filter = (ch) =>
            (ch.parentID == categoryID)
            && (ch.id !== voiceID)
            && (Old.voiceChannelID == ch.id)
            && (Old.voiceChannel.members.size == 0);
        
        return Old.guild.channels
            .filter(filter)
            .forEach((ch) => ch.delete());
    }
});