const BaseCommand = require('../../utils/structures/BaseCommand');
const { Database } = require('npm.db');
const { MessageEmbed } = require('discord.js');
const db = new Database('mute');
module.exports = class UnmuteCommand extends BaseCommand {
  constructor() {
    super('unmute', 'mute', []);
  }

  run(client, message, args) {
    const muteroleid = db.get(`cezalı_rol.${message.guild.id}`);
    const mutelogid = db.get(`log.${message.guild.id}`);
    const authid = db.get(`yetkili.${message.guild.id}`);
    const muterole = message.guild.roles.cache.get(muteroleid);
    const mutelog = message.guild.channels.cache.get(mutelogid);
    const authrole = message.guild.roles.cache.get(authid);
    if(!muterole || !mutelog || !authrole) return message.reply('Gerekli ayarlamalar yapılmadığı için bu komut kullanılamaz');
    if(!message.member.roles.cache.find(a => a.id === authrole.id)) return message.reply('Bunun için gerekli role sahip değilsin');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) message.reply("Bir kişi etiketlemelisin veya ID'sini girmelisin");
    const durum = db.get(`durum.${message.guild.id}.${message.author.id}`);
    if(!durum) return message.reply('Bu kişinin zaten mutesi yok');
    let sebep = args.slice(1).join(' ');
    if(!sebep){
      sebep = 'Sebep belirtilmedi';
    }
    message.channel.send(new MessageEmbed() .setDescription(`*${member.user.username}#${member.user.discriminator} kişisinin mutesi başarıyla kaldırıldı.*`))
    try{
      member.roles.remove(muterole);
      const bitti = new MessageEmbed()
      .setTitle('Mute Bitti')
      .addFields(
      {name: 'Yetkili:', value: message.author, inline: true},
      {name: 'Cezası biten kişi', value: member, inline: true},
      {name: 'Ceza sebebi:', value: sebep}
      )
      .setTimestamp();
      mutelog.send(bitti);
      db.delete(`durum.${message.guild.id}.${message.author.id}`)
    }catch(err){
      console.log(err)
    }
  }
}