const Discord = require('discord.js');
const client = new Discord.Client();
const game = require(__dirname+"/game/main.js");
const token = '';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

function onMessage(msg){
  if(msg.hasOwnProperty("author")){
    let text = msg.content+"";
    let response=game.read(text,msg.channel.type);
    if(response!=""){
      msg.reply(response)
      .then(sent => console.log(`Sent a reply to ${sent.author.username}`))
      .catch(console.error);
    }
  }
}

client.on('message', msg => {
  onMessage(msg);
});

client.login(token);
