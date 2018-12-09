'use strict';

/**
Game Class, this is where the fun begins.

Every message from Discord is setn to read function, where it creates the player of the user that sent the message if it doesn't exist
and handles the message with commandHandler.
**/

const User = require(__dirname+"/UserClass.js");
const Message = require('discord.js').RichEmbed;
const CommandConstructor = require(__dirname+"/commands/CommandConstructorClass.js");

module.exports = class Game {
  constructor() {
    this.users = {};
    this.commandConstructor = new CommandConstructor();
    this.commands = this.commandConstructor.initCommands();
  }

  getCommand(command){
    if(this.commands[command]){
      return this.commands[command];
    } else {
      return null;
    }
  }

  errorMessage(){
    var m = new Message();
    m.setTitle("Unknown command");
    m.setDescription("Please write help to see the command list.");
    return m;
  }

  claimCookiesUsers(){
    for(var u in this.users){
      this.users[u].claimCookies();
    }
  }

  getUser(info){
    if(!this.users.hasOwnProperty(info.id)){
      this.users[info.id] = new User(info.id);
    }
    this.users[info.id].setInfo(info);
    this.claimMessage(this.users[info.id]);
    return this.users[info.id];
  }

  claimMessage(user){
    user.addCookie();
  }
}
