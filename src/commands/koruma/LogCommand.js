const BaseCommand = require('../../utils/structures/BaseCommand');
const { Database } = require('npm.db');
const { MessageEmbed } = require('discord.js');
const db = new Database('koruma');
module.exports = class LogCommand extends BaseCommand {
  constructor() {
    super('log', 'koruma', []);
  }

  run(client, message, args) {
    if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply('Bunun için yeterli yetkin yok');
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if(!channel) return message.reply("Bir kanal etiketlemeniz veya ID'sini girmeniz lazım");
    const embed = new MessageEmbed()
    .setTitle('İşlem Başarılı')
    .setDescription(`Koruma Log kanalı başarıyla ${channel} olarak ayarlandı`);
    message.channel.send(embed);
    db.set(`log.${message.guild.id}`, channel.id);
  }
}