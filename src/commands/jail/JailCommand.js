const BaseCommand = require('../../utils/structures/BaseCommand');
const { Database } = require('npm.db');
const { MessageEmbed } = require('discord.js');
const db = new Database('jail');
module.exports = class JailCommand extends BaseCommand {
  constructor() {
    super('jail', 'jail', []);
  }

  run(client, message, args) {
    const jailroleid = db.get(`cezalı_rol.${message.guild.id}`);
    const jaillogid = db.get(`log.${message.guild.id}`);
    const authid = db.get(`yetkili.${message.guild.id}`);
    const jailrole = message.guild.roles.cache.get(jailroleid);
    const jaillog = message.guild.channels.cache.get(jaillogid);
    const authrole = message.guild.roles.cache.get(authid);
    if(!jailrole || !jaillog || !authrole) return message.reply('Gerekli ayarlamalar yapılmadığı için bu komut kullanılamaz');
    if(!message.member.roles.cache.find(a => a.id === authrole.id)) return message.reply('Bunun için gerekli role sahip değilsin');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) message.reply("Bir kişi etiketlemelisin veya ID'sini girmelisin");
    if(member.roles.cache.find(a => a.id === jailrole.id)) return message.reply('Bu kişi zaten jailde');
    try{
      let sebep = args.slice(1).join(' ');
      if(!sebep){
        sebep = 'Sebep belirtilmedi';
      }
    member.roles.cache.forEach(role => {
      if(role.name !== "@everyone"){
        member.roles.remove(role);
      }
      
      
    });
    message.channel.send(new MessageEmbed() .setDescription(`*${member.user.username}#${member.user.discriminator} kişisi jaile atıldı*`))
 
      member.roles.add(jailrole)
    
    
    const embed = new MessageEmbed()
    .setTitle('Jail İşlemi')
    .addFields(
      {name: 'Yetkili:', value: message.author, inline: true},
        {name: 'Ceza alan kişi:', value: member, inline: true},
        {name: 'Ceza sebebi:', value: sebep}
    )
    jaillog.send(embed)
    
    
  }catch(err){
    console.log(err)
  }

  }
}