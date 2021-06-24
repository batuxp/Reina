const BaseCommand = require('../../utils/structures/BaseCommand');
const { Database } = require('npm.db');
const { MessageEmbed } = require('discord.js');
const db = new Database('jail');
module.exports = class Jail_yetkiliCommand extends BaseCommand {
  constructor() {
    super('jail-yetkili', 'jail', []);
  }

  run(client, message, args) {
    if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply('Bunun için yeterli yetkin yok');
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if(!role) return message.reply("Bir rol etiketlemen veya ID'sini girmen lazım");
    const embed = new MessageEmbed()
    .setTitle('İşlem Başarılı')
    .setDescription(`Jail yetkili rolü başarıyla ${role} olarak ayarlandı`);
    message.channel.send(embed);
    db.set(`yetkili.${message.guild.id}`, role.id);
  }
}