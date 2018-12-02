'use strict';

/**
  Game Class, this is where the fun begins.

  Every message from Discord is setn to read function, where it creates the player of the user that sent the message if it doesn't exist
  and handles the message with commandHandler.
**/

const User = require(__dirname+"/UserClass.js");
const BuildingConstructor = require(__dirname+"/BuildingConstructorClass.js");

module.exports = class Game {
  constructor() {
    this.prefix = "!";
    this.users = {};
    this.constructor = new BuildingConstructor();
    this.daemon = setInterval(function(){
      for(var u in this.users){
        this.users[u].claimCookies();
      }
    },1000);
  }

  commandHandler(msg){
    let response = "";
    let text = msg.content+"";
    if(text.indexOf(this.prefix)===0){
      text=text.substring(this.prefix.length,text.length);
      var command = text.split(" ");
      var user=this.users[msg.author.id];
      switch(command[0]){
        case "info":
          response="You have "+user.cookies+" cookies\nBuildings owned:\n";
          for(var i in user.buildings){
            response+=user.buildings[i].name+" (Level: "+user.buildings[i].level+")\n";
          }
          break;

        case "buy":
          var userBuilding= user.getBuilding(parseInt(command[1]));
          if(userBuilding== null) {
            var building=this.constructor.createBuilding(parseInt(command[1]));
            if(building!=null){
              if(building.acquire(user)){
                response="You bought a building "+command[1]+"!";
              } else {
                response=user.mention+" don't have enough cookies...";
              }
            } else {
              response = "This building doesn't exist";
            }
          } else if(userBuilding.levelUp(user)){
            response="You upgraded your building !";
          } else {
            response=user.mention+" don't have enough cookies...";
          }
          break;
        default:
          response = "Unknown command";
          break;
      }
    }
    return response;
  }

  read(msg){
    let result = "";
    if(!this.users.hasOwnProperty(msg.author.id)){
      this.users[msg.author.id] = new User(msg.author.id);
    }
    this.users[msg.author.id].cookies++;
    return this.commandHandler(msg);
  }

}
