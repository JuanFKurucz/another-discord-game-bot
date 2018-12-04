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
    this.functionPrefix = "execute_";
    this.users = {};
    this.constructor = new BuildingConstructor();
  }

  claimCookiesUsers(){
    for(var u in this.users){
      this.users[u].claimCookies();
    }
  }

  getUser(id){
    if(!this.users.hasOwnProperty(id)){
      this.users[id] = new User(id);
    }
    this.claimMessage(this.users[id]);
    return this.users[id];
  }

  claimMessage(user){
    user.addCookie();
  }

  execute_info(user,command){
    let response="You have "+user.cookies+" cookies\nBuildings owned:\n";
    for(var i in user.buildings){
      response+=user.buildings[i].name+" (Level: "+user.buildings[i].level+")\n";
    }
    return response;
  }

  execute_buy(user,command){
    let id_building = parseInt(command[1]);
    let response='';
    var userBuilding = user.getBuilding(id_building);
    if(userBuilding== null) {
      var building = this.constructor.createBuilding(id_building);
      if(building!=null){
        if(building.acquire(user)){
          response="You bought a building "+id_building+"!";
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
    return response;
  }

}
