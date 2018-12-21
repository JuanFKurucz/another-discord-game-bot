'use strict';

/**
  This is the BotClass, pretty similar to the GameClass (i might merge them or something later)

  This handles discord.js library, basically the connection to the Discord Server as a bot, getting messages and such.
  Nothing much to see here, every message is sent to the GameClass
**/

const Discord = require('discord.js');
const Message = require('discord.js').RichEmbed; //https://discord.js.org/#/docs/main/stable/class/RichEmbed
const Game = require(__dirname+"/game/GameClass.js");

let BotObject = null;

module.exports = class Bot {
  static get(){
    if(BotObject===null){
      BotObject = new Bot();
    }
    return BotObject;
  }

  constructor(debugMode=true) {
    this.prefix = "!";
    this.game = new Game();
    this.client = new Discord.Client();
    this.debugMode = debugMode;
    this.debuggChannel = "521806120134639627";
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
      console.log(`Logged in as ${this.client.user.tag}!`,1);
      if(this.debugMode){
        let trainingChannel = this.client.channels.get(this.debuggChannel);
        if(trainingChannel){
          trainingChannel.send("Everything is started for testing");
        }
      }
    });
    this.client.on('message', msg => {
      this.onMessage(msg);
    });
    this.client.login(token);
  }

  isACommand(text){
    return text.indexOf(this.prefix)===0;
  }

  /**
    commandHandler:

    This function gets a Discord Message object (https://discord.js.org/#/docs/main/stable/class/Message) as the only parameter
    With this Message it will decide if the content of the message is a command for the bot (if it starts with the prefix).
    It will execute the command for the prefix if it has one, if it doesn't it will do nothing instead.
  **/
  async commandHandler(msg){
    const user = await this.game.getUser(msg.author),
          text = msg.content+"";
    let response = null,
        command;

    this.game.onMessage(user); //handles what to do when a user send a message (Ex: gives cookies);

    if(this.isACommand(text)){
      response = new Message(); //Instances a new discord RichEmbed;

      console.log(msg.author.id +" sent "+msg.content,1);

      command = text.substring(this.prefix.length,text.length).toLowerCase().split(" "); //Splits the text of the message in spaces removing the prefix out of it

      console.performance();

      await this.game.getCommand(command[0]).execute(response,user,command); //gets the command using the first string in the splitteed message and executes it
    }

    return response;
  }

  getUserIcon(author){
    return 'https://cdn.discordapp.com/avatars/'+author.id+'/'+author.avatar+'.webp?size=128';
  }

  async onMessage(msg){
    if(msg.hasOwnProperty("author") && !msg.author.bot && (!this.debugMode || (this.debugMode && msg.channel.id === this.debuggChannel))){
      let response=await this.commandHandler(msg);
      if(response!==null){
        response.setFooter(msg.author.username,this.getUserIcon(msg.author));
        response.setTimestamp(new Date());
        msg.channel.send(response)
        .then(message => console.log(`Reply message: ${response}`))
        .catch(console.error);
      }
    }
  }
}
