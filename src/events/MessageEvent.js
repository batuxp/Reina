// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-message
const BaseEvent = require('../utils/structures/BaseEvent');
const { Database } = require('npm.db');
const { MessageEmbed } = require('discord.js');
const db = new Database('koruma');
const data = new Database('spam');
module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super('message');
  }
  
  async run(client, message) {
  //  if(message.member.permissions.has('BAN_MEMBERS')) return;
    if(message.author.bot) return;
    const küfür = db.get(`küfür.${message.guild.id}`);
    const link = db.get(`link.${message.guild.id}`);
    const spam = db.get(`spam.${message.guild.id}`);
    const logid = db.get(`log.${message.guild.id}`);
    const log = message.guild.channels.cache.get(logid);
    const caps_lock = db.get(`caps_lock.${message.guild.id}`);
    if(küfür){
      const küfürler = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "sik", "yarrak", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "amq", "sg", "s.ktir"];
      if(küfürler.some(a => message.content.toLocaleLowerCase().includes(a))){
        message.delete();
        const silindi = new MessageEmbed()
        .setDescription( `${message.author} cık cık küfür çok ayıp`);
        message.channel.send(silindi).then(msg => msg.delete({timeout: 15000}));
        if(log){
          const embedlog = new MessageEmbed()
          .setTitle('Küfür Yakaladım')
          .addFields(
            {name: 'Küfür eden kişi:', value: message.author, inline: true},
            {name: 'Edilen küfür:', value: message.content, inline: true}
          )
          .setTimestamp()
          .setThumbnail(message.author.displayAvatarURL())
          log.send(embedlog);
        }
      }
   
    }

    if(link){
      const linkler = [".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", "net", ".rf.gd", ".az", ".party", "discord.gg"];
      if(linkler.some(a => message.content.toLocaleLowerCase().includes(a))){
        message.delete();
        const silindi = new MessageEmbed()
        .setDescription( `${message.author} bu sunucuda reklam yasak bunu bilmiyor musun?`);
        message.channel.send(silindi).then(msg => msg.delete({timeout: 15000}));
        if(log){
          const embedlog = new MessageEmbed()
          .setTitle('Reklam Yakaladım')
          .addFields(
            {name: 'Reklamı yapan kişi:', value: message.author, inline: true},
            {name: 'Yapılan reklam:', value: message.content, inline: true}
          )
          .setTimestamp()
          .setThumbnail(message.author.displayAvatarURL())
          log.send(embedlog);
        }
      }
    }
    if(spam){
      
      const lastMessage = data.get(`last.${message.guild.id}.${message.author.id}`);
      const spamSayı = data.get(`sayı.${message.guild.id}.${message.author.id}`);
      if(lastMessage && (Date.now() - lastMessage ) < 3000){
        
        if(spamSayı < 5){
          let now = spamSayı+1;
         
          data.set(`sayı.${message.guild.id}.${message.author.id}`, now);
          data.set(`last.${message.guild.id}.${message.author.id}`, Date.now());
          
        }else if(spamSayı >= 5){
          message.delete();
         
    message.channel.messages.fetch({
      limit: spamSayı
    }).then(messages => message.channel.bulkDelete(messages));
        const uyarı = new MessageEmbed()
        .setDescription(`${message.author} çok hızlı mesaj gönderiyorsun`);
        message.channel.send(uyarı).then(msg => msg.delete({timeout: 15000}));
        data.set(`last.${message.guild.id}.${message.author.id}`, Date.now());
        data.set(`sayı.${message.guild.id}.${message.author.id}`, 3);
        }
        
      }else{
        data.set(`last.${message.guild.id}.${message.author.id}`, Date.now());
       
          data.set(`sayı.${message.guild.id}.${message.author.id}`, 0)
       
       
      }
    }
    if(caps_lock){
      if(message.content.length < 7) return;
      let  i;
      let caps = 0;
      let yokcaps = 0;
     
      for(i = 0; message.content.length > i; i++){
     
        if(message.content[i].toUpperCase() === message.content[i]){
          caps++;
        }else{
          yokcaps++;
        }
      }
     let a = caps/message.content.length;
     let b = a * 100;
 
    
   
      if(b >= 50){
        message.delete()
        const uyarı = new MessageEmbed()
        .setDescription(`${message.author} mesajın çok fazla büyük harf içeriyor`);
        message.channel.send(uyarı).then(msg => msg.delete({timeout: 15000}));
      }
    }

    
  }
}