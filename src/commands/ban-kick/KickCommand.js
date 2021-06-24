const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed} = require('discord.js');
module.exports = class KickCommand extends BaseCommand {
  constructor() {
    super('kick', 'ban-kick', []);
  }

  run(client, message, args) {
    if(!message.member.permissions.has('KICK_MEMBERS')) return message.reply('Bunun için gerekli yetkin yok');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) return message.reply('Bir kişi etiketlemelisin');
    if(member.user.id === message.author.id) return message.reply('Kendini atamazsın');
    const embed = new MessageEmbed()
    .setDescription(`*${member.user.username}#${member.user.discriminator} kişisi sunucudan atıldı*`);
    message.channel.send(embed);
    member.kick();
  }
}