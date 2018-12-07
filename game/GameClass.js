'use strict';

/**
Game Class, this is where the fun begins.

Every message from Discord is setn to read function, where it creates the player of the user that sent the message if it doesn't exist
and handles the message with commandHandler.
**/

const User = require(__dirname+"/UserClass.js");
const BuildingConstructor = require(__dirname+"/BuildingConstructorClass.js");
const Message = require(__dirname+"/MessageClass.js");

module.exports = class Game {
  constructor() {
    this.functionPrefix = "execute_";
    this.users = {};
    this.constructor = new BuildingConstructor();
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

  execute_info(user,command){
    var m = new Message();
    m.setTitle("Info");
    let response="You have "+user.cookies+" cookies";
    m.setDescription(response);
    let buildings="";
    for(var i in user.buildings){
      buildings+=user.buildings[i].name+" (Level: "+user.buildings[i].level+")\n";
    }
    m.addField("Buildings owned",buildings);
    return m;
  }

  buyBuilding(command,user){
    var m = new Message();
    m.setTitle("Buy building");
    let response="";
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
    m.setDescription(response);
    return m;
  }

  displayBuildingList(user){
    var m = new Message();
    var nbuilding=null,
        response="";
    response="";
    m.setTitle("List of buildings");
    for(var w in this.constructor.elements){
      nbuilding=user.getBuilding(w);
      if(!nbuilding){
        nbuilding= this.constructor.create(w);
      }
      nbuilding=nbuilding.nextLevelInfo();
      response += w+". "+ nbuilding.name + " ("+nbuilding.level+")" +
      " Price: "+ nbuilding.cost +
      " Cps: "+ nbuilding.cps;
      if(user.cookies<nbuilding.cost){
        response += " (Not affordable yet)\n";
      } else {
        response += "\n";
      }
    }
    m.setDescription(response);
    return m;
  }

  execute_buy(user,command){
    if(command.length>1){
      return this.buyBuilding(command,user)
    } else {
      return this.displayBuildingList(user);
    }
  }

}
