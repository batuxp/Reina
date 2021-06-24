const BaseCommand = require('../../utils/structures/BaseCommand');
const { Database } = require('npm.db');
const { MessageEmbed } = require('discord.js');
const db = new Database('koruma');
module.exports = class SpamCommand extends BaseCommand {
  constructor() {
    super('spam', 'koruma', []);
  }

  run(client, message, args) {
    if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply('Bunun için yeterli yetkin yok');
    if(!args[0]) return message.reply('Bu özelliği açman ya da kapaman lazım. Örn: `!spam aç` veya `!spam kapat`');
    const durum = db.get(`spam.${message.guild.id}`);
    if(args[0] === "aç"){
      if(durum) return message.reply('Bu özellik zaten açık');
      const embed = new MessageEmbed()
      .setTitle('İşlem Başarılı')
      .setDescription('Spam Engel özelliği bu sunucu için başarıyla açıldı')
      message.channel.send(embed);
      db.set(`spam.${message.guild.id}`, true);
    }else if(args[0] === "kapat"){
      if(!durum) return message.reply('Bu özellik zaten kapalıymış');
      const embed = new MessageEmbed()
      .setTitle('İşlem Başarılı')
      .setDescription('Spam Engel özelliği bu sunucu için başarıyla kapatıldı')
      message.channel.send(embed);
      db.delete(`spam.${message.guild.id}`);
    }else{
      message.reply('Bu özelliği açman ya da kapaman lazım. Örn: `!spam aç` veya `!spam kapat`');
    }
  }
}