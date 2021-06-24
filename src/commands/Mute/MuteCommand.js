const BaseCommand = require('../../utils/structures/BaseCommand');
const { Database } = require('npm.db');
const { MessageEmbed } = require('discord.js');
const db = new Database('mute');
const ms = require('ms');
module.exports = class MuteCommand extends BaseCommand {
  constructor() {
    super('mute', 'Mute', []);
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
    if(durum) return message.reply('Bu kişi zaten mutelenmiş');
    const zaman = ms(args[1]
      .replace('saniye', 's')
      .replace('sn', 's')
      .replace('dakika', 'm')
      .replace('dk', 'm')
      .replace('saat', 'h')
      .replace('sa', 'h')
      .replace('gün', 'd')
      .replace('g', 'd')
      )
      if(!zaman) return message.reply("Bir süre girmen lazım. Örn: `!mute @kişi 15dakika küfür`");
      let sebep = args.slice(2).join(' ');
      if(!sebep){
        sebep = 'Sebep belirtilmedi';
      }
      message.channel.send(new MessageEmbed() .setDescription(`*${member.user.username}#${member.user.discriminator} kişisine başarıyla mute verildi*`))
      db.set(`durum.${message.guild.id}.${message.author.id}`, true)
     try{
      
      member.roles.add(muterole);
      const ceza = new MessageEmbed()
      .setTitle('Mute İşlemi')
      .addFields(
        {name: 'Yetkili:', value: message.author, inline: true},
        {name: 'Ceza alan kişi:', value: member, inline: true},
        {name: 'Ceza sebebi:', value: sebep}
      )
      mutelog.send(ceza);
      
      setTimeout(() => {
        if(!durum) return;
        member.roles.remove(muterole);
        const bitti = new MessageEmbed()
        .setTitle('Mute Bitti')
        .addFields(
        {name: 'Yetkili:', value: 'Otomatik Moderatör', inline: true},
        {name: 'Cezası biten kişi', value: member, inline: true},
        {name: 'Ceza sebebi:', value: 'Süre bitti'}
        )
        .setTimestamp();
        mutelog.send(bitti);
        db.delete(`durum.${message.guild.id}.${message.author.id}`)
      }, zaman)
     }catch(err){
       console.log(err)
     }


  }
}