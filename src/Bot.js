"use strict";

/**
  This is the BotClass, pretty similar to the GameClass (i might merge them or something later)

  This handles discord.js library, basically the connection to the Discord Server as a bot, getting messages and such.
  Nothing much to see here, every message is sent to the GameClass
**/

const Discord = require('discord.js'),
      Message = require("./Message.js"), //https://discord.js.org/#/docs/main/stable/class/RichEmbed
      Game = require(__dirname+"/game/Game.js");

let BotObject = null;

module.exports = class Bot {
  constructor(debugMode=true) {
    this.prefix = "!";
    this.game = new Game(this.prefix);
    this.client = new Discord.Client();
    this.debugMode = debugMode;
    this.debuggChannels = ["526844501570879489"];

    this.dictionary = { //3x5
      "a":"bbb bnb bnb bbb bnb",
      "b":"bbn bnb bbn bnb bbn",
      "c":"bbb bnn bnn bnn bbb",
      "d":"bbn bnb bnb bnb bbn",
      "e":"bbb bnn bbb bnn bbb",
      "f":"bbb bnn bbb bnn bnn",
      "g":"bbb bnn bnb bnb bbb",
      "h":"bnb bnb bbb bnb bnb",
      "i":"nbn nbn nbn nbn nbn",
      "j":"nnb nnb nnb nnb bbb",
      "k":"bnb bnb bbn bnb bnb",
      "l":"bnn bnn bnn bnn bbb",
      "m":"bnb bbb bnb bnb bnb",
      "n":"nnb bnb bbb bnb bnn",
      "o":"bbb bnb bnb bnb bbb",
      "p":"bbb bnb bbb bnn bnn",
      "q":"bbb bnb bnb bbb nnb",
      "r":"bbn bnb bbn bnb bnb",
      "s":"bbb bnn bbb nnb bbb",
      "t":"bbb nbn nbn nbn nbn",
      "u":"bnb bnb bnb bnb bbb",
      "v":"bnb bnb bnb bnb nbn",
      "w":"bnb bnb bnb bbb bnb",
      "x":"bnb bnb nbn bnb bnb",
      "y":"bnb bnb nbn nbn nbn",
      "z":"bbb nnb nbn bnn bbb",
      " ":", , , , ,"
    };
    this.emojis = {
      "b":526982553807224842,
      "n":526982553811288084,
      ",":526981193003171850
    };

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

  async getEmoji(id){
    if(id==""){
      return "";
    }
    try{
      const emojiList = this.client.guilds.get("509053465016795147").emojis,
            emoji = await emojiList.find(emoji => emoji.id == id);
      if(emoji){
        return emoji.toString();
      }
    } catch(e){

    }
    return "";
  }

  async writeChars(msgAbstract,index,max,callback){
    let realmessage="",
        partMessage=(msgAbstract+" "+msgAbstract).slice(index,index+max);
    const list1=this.dictionary[partMessage[0]].split(" ");

    for(let y=0;y<list1.length;y++){
      for(let m=0;m<max;m++){
        if(m<partMessage.length){
          let list = this.dictionary[partMessage[m]].split(" ");
          for(let w=0;w<list[y].length;w++){
            try{
              realmessage+=await this.getEmoji(this.emojis[list[y][w]]);
            }catch(e){

            }
          }
          realmessage+=" ";
        }
      }
      realmessage+="\n";
    }
    return realmessage;
  }

  async doThisAgain(msg,messageText,actualIndex,max){
    try{
      await msg.edit(await this.writeChars(messageText,actualIndex,max)+"\n"+actualIndex);
    }catch(e){

    }
    actualIndex++;
    if(actualIndex>=messageText.length){
      actualIndex=0;
    }
    setTimeout(()=>{this.doThisAgain(msg,messageText,actualIndex,max)},500);
  }

  async start(token){
    await this.game.loadUsers();
    this.client.on('ready',() => {
      console.log(`Logged in as ${this.client.user.tag}!`,1);
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
  async commandHandler(msg,user){
    const text = msg.content+"";
    let response = null,
        command;

    if(this.isACommand(text)){
      response = new Message(user); //Instances a new discord RichEmbed;

      console.log(msg.author.id +" sent "+msg.content,1);

      command = text.substring(this.prefix.length,text.length).toLowerCase().split(" "); //Splits the text of the message in spaces removing the prefix out of it

      console.time();

      await this.game.getCommand(command[0],user).execute(response,user,command); //gets the command using the first string in the splitteed message and executes it
    }

    return response;
  }

  async onMessage(msg){
    if(msg.hasOwnProperty("author") && !msg.author.bot && (!this.debugMode || (this.debugMode && this.debuggChannels.indexOf(msg.channel.id)!==-1))){

      const user = await this.game.getUser(msg.author);
      this.game.onMessage(user); //handles what to do when a user send a message (Ex: gives cookies);
      const response=await this.commandHandler(msg,user);

      if(response!==null){
        msg.channel.send(response.print())
        .then(async (message) => {
          await user.setLastResponse(message);
          console.log("Message sent");
        })
        .catch(console.error);
      }
      user.emptyMessageLang();
    }
  }

  static get(){
    if(BotObject===null){
      BotObject = new Bot();
    }
    return BotObject;
  }
}
