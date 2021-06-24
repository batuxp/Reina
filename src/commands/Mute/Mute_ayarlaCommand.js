const BaseCommand = require('../../utils/structures/BaseCommand');
const { Database } = require('npm.db');
const { MessageEmbed } = require('discord.js');
const db = new Database('mute');
module.exports = class Mute_ayarlaCommand extends BaseCommand {
  constructor() {
    super('mute-ayarla', 'Mute', []);
  }

  run(client, message, args) {
    if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply('Bunun için yeterli yetkin yok');
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if(!role) return message.reply("Bir rol etiketlemen veya ID'sini girmen lazım");
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
    if(!channel) return message.reply("Bir kanal etiketlemen veya ID'sini girmen lazım");
    const embed = new MessageEmbed()
    .setTitle('İşlem Başarılı')
    .setDescription(`Mute cezalı rolü ${role} olarak. Mute logu ise ${channel} olarak ayarlandı`);
    message.channel.send(embed);
    db.set(`cezalı_rol.${message.guild.id}`, role.id);
    db.set(`log.${message.guild.id}`, channel.id);
  }
}