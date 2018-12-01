const Discord = require('discord.js');
const client = new Discord.Client();
const game = require(__dirname+"/game/main.js");

const token = 'NTE4NDc3Nzc3NTcwMTAzMjk2.DuRVpw.FrIJP52YjMI_ZRr2Jr_VI0ZzhmI';
const botId = "518477777570103296";

function onMessage(msg){
  if(msg.hasOwnProperty("author") && msg.author.id != botId){
    let text = msg.content+"";
    let response=game.read(msg);
    if(response!=""){
      msg.reply(response)
      .then(sent => console.log(`Sent a reply to ${sent.author.username}`))
      .catch(console.error);
    }
  }
}

function start(db){
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
  client.on('message', msg => {
    onMessage(msg);
  });
  client.login(token);
}

module.exports = {
  start:start
}
