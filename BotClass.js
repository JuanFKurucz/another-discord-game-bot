'use strict';

/**
  This is the BotClass, pretty similar to the GameClass (i might merge them or something later)

  This handles discord.js library, basically the connection to the Discord Server as a bot, getting messages and such.
  Nothing much to see here, every message is sent to the GameClass
**/

const Discord = require('discord.js');
const Game = require(__dirname+"/game/GameClass.js");
const Message = require(__dirname+"/game/MessageClass.js");

module.exports = class Bot {
  constructor() {
    this.prefix = "!";
    this.game = new Game();
    this.client = new Discord.Client();

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

  commandHandler(msg,messageObject){
    let response = "";
    let text = msg.content+"";
    var user=this.game.getUser(msg.author);

    if(text.indexOf(this.prefix)===0){
      text=text.substring(this.prefix.length,text.length).toLowerCase();
      var command = text.split(" ");

      let call = this.game.functionPrefix+command[0];

      if(typeof this.game[call] === 'function'){
        this.game[call](messageObject,user,command);
      } else {
        messageObject.setTitle("Unknown command");
        messageObject.setDescription("Please write "+this.prefix +"help to see the command list.");
      }
    }

    return response;
  }

  onMessage(msg){
    if(msg.hasOwnProperty("author") && !msg.author.bot){
      let text = msg.content+"";
      let messageObject = new Message(this.client);

      this.commandHandler(msg,messageObject);

      let response=messageObject.print();
      if(response!==null){
        msg.channel.send(response)
        .then(message => console.log(`Sent message: ${message.content}`))
        .catch(console.error);
      }
    }
  }
}
