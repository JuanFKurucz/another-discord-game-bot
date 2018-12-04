'use strict';

/**
  This is the BotClass, pretty similar to the GameClass (i might merge them or something later)

  This handles discord.js library, basically the connection to the Discord Server as a bot, getting messages and such.
  Nothing much to see here, every message is sent to the GameClass
**/

const Discord = require('discord.js');
const Game = require(__dirname+"/game/GameClass.js");

module.exports = class Bot {
  constructor(botId) {
    this.prefix = "!";
    this.game = new Game();
    this.client = new Discord.Client();
    this.id=botId;

    this.startDaemon();
  }

  startDaemon(){
    var self = this;
    self.g = this.game;
    self.set = setInterval(function(){
      self.g.claimCookiesUsers();
    },1000);
  }

  start(token){
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });
    this.client.on('message', msg => {
      this.onMessage(msg);
    });
    this.client.login(token);
  }

  commandHandler(msg){
    var user=this.game.getUser(msg.author.id);
    user.addCookie();

    let response = "";
    let text = msg.content+"";
    if(text.indexOf(this.prefix)===0){
      text=text.substring(this.prefix.length,text.length);
      var command = text.split(" ");
      switch(command[0]){
        case "info":
          response=this.game.execute_info(user);
          break;
        case "buy":
          response = this.game.execute_buy(user,parseInt(command[1]));
          break;
        default:
          response = "Unknown command";
          break;
      }
    }
    return response;
  }

  onMessage(msg){
    if(msg.hasOwnProperty("author") && msg.author.id != this.id){
      let text = msg.content+"";
      let response = this.commandHandler(msg);//this.game.read(msg);
      if(response!=""){
        msg.channel.send(response)
        .then(message => console.log(`Sent message: ${message.content}`))
        .catch(console.error);
      }
    }
  }
}
