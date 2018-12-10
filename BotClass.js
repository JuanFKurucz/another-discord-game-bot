'use strict';

/**
  This is the BotClass, pretty similar to the GameClass (i might merge them or something later)

  This handles discord.js library, basically the connection to the Discord Server as a bot, getting messages and such.
  Nothing much to see here, every message is sent to the GameClass
**/

const Discord = require('discord.js');
const Message = require('discord.js').RichEmbed;
const Game = require(__dirname+"/game/GameClass.js");

let BotObject = null;

module.exports = class Bot {
  static get(){
    if(BotObject===null){
      BotObject = new Bot();
    }
    return BotObject;
  }

  constructor() {
    this.prefix = "!";
    this.game = new Game();
    this.client = new Discord.Client();
    this.startDaemon();
  }

  getPrefix(){
    return this.prefix;
  }

  startDaemon(){
    setInterval( () => {
      this.game.claimCookiesUsers();
    },1000);
  }

  async saveDatabase(){
    await this.game.saveUsers();
  }

  async start(token){
    await this.game.loadUsers();
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });
    this.client.on('message', msg => {
      this.onMessage(msg);
    });
    this.client.login(token);
  }

  async commandHandler(msg){
    let response = null;
    let text = msg.content+"";
    var user=await this.game.getUser(msg.author);

    if(text.indexOf(this.prefix)===0){
      text=text.substring(this.prefix.length,text.length).toLowerCase();
      var command = text.split(" ");

      let call = command[0];
      let commandFunc = this.game.getCommand(call);
      response = new Message();
      if(!commandFunc){
        commandFunc=this.game.getCommand("error");
      }
      commandFunc.execute(response,user,command);
    }

    return response;
  }

  async onMessage(msg){
    if(msg.hasOwnProperty("author") && !msg.author.bot){
      let response=await this.commandHandler(msg);
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
