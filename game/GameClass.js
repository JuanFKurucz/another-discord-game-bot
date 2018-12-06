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

  execute_info(user,command){
    let response="You have "+user.cookies+" cookies\nBuildings owned:\n";
    for(var i in user.buildings){
      response+=user.buildings[i].name+" (Level: "+user.buildings[i].level+")\n";
    }
    return response;
  }

  execute_buy(user,command){
    let response='';
    if(command.length>1){
      let id_building = parseInt(command[1]);
      var userBuilding = user.getBuilding(id_building);
      if(userBuilding== null) {
        var building = this.constructor.create(id_building);
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
    } else {
      var nbuilding;
      response="List of buildings\n";
      for(var w in this.constructor.elements){
        if(user.getBuilding(w)==null){
          response += this.constructor.elements[w].name +
          " Price: "+ this.constructor.elements[w].cost +
          " Cps: "+ this.constructor.elements[w].cps+"\n"
        } else {
          nbuilding = user.buildings[w].nextLevelInfo();
          response += nbuilding.name +
          " Price: "+ nbuilding.cost +
          " Cps: "+ nbuilding.cps+"\n"
        }

      }

    }

    return response;
  }

}
