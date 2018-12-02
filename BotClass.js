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
    this.game = new Game();
    this.client = new Discord.Client();
    this.id=botId;
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

  onMessage(msg){
    if(msg.hasOwnProperty("author") && msg.author.id != this.id){
      let text = msg.content+"";
      let response = this.game.read(msg);
      if(response!=""){
        msg.channel.send(response)
        .then(message => console.log(`Sent message: ${message.content}`))
        .catch(console.error);
      }
    }
  }
}
