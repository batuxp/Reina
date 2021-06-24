const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class BanCommand extends BaseCommand {
  constructor() {
    super('ban', 'ban-kick', []);
  }

  run(client, message, args) {
    if(!message.member.permissions.has('BAN_MEMBERS')) return message.reply('Bunun için gerekli yetkin yok');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) return message.reply('Bir kişi etiketlemelisin');
    if(member.user.id === message.author.id) return message.reply('Kendini banlayamazsın');
    let sebep = args.slice(1).join(' ');
    if(!sebep){
      sebep = 'Sebep belirtilmedi'
    }
    const embed = new MessageEmbed()
    .setDescription(`*${member.user.username}#${member.user.discriminator} kişisi sunucudan banlandı*`);
    message.channel.send(embed);
    member.ban({reason: sebep});
  }
}