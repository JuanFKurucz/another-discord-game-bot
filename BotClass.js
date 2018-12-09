'use strict';

/**
  This is the BotClass, pretty similar to the GameClass (i might merge them or something later)

  This handles discord.js library, basically the connection to the Discord Server as a bot, getting messages and such.
  Nothing much to see here, every message is sent to the GameClass
**/

const Discord = require('discord.js');
const Message = require('discord.js').RichEmbed;
const Game = require(__dirname+"/game/GameClass.js");

module.exports = class Bot {
  constructor() {
    this.prefix = "!";
    this.game = new Game();
    this.client = new Discord.Client();
    this.startDaemon();
  }

  startDaemon(){
    setInterval( () => {
      this.game.claimCookiesUsers();
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
    let response = null;
    let text = msg.content+"";
    var user=this.game.getUser(msg.author);

    if(text.indexOf(this.prefix)===0){
      text=text.substring(this.prefix.length,text.length).toLowerCase();
      var command = text.split(" ");

      let call = command[0];
      let commandFunc = this.game.getCommand(call);
      if(commandFunc){
        return commandFunc.execute(user,command);
      } else {
        return this.game.errorMessage();
      }
    }

    return response;
  }

  onMessage(msg){
    if(msg.hasOwnProperty("author") && !msg.author.bot){
      let response=this.commandHandler(msg);
      if(response!==null){
        response.setFooter(this.client.user.username);
        response.setTimestamp(new Date());
        msg.channel.send(response)
        .then(message => console.log(`Sent message: ${response}`))
        .catch(console.error);
      }
    }
  }
}
