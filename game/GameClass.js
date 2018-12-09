'use strict';

/**
Game Class, this is where the fun begins.

Every message from Discord is setn to read function, where it creates the player of the user that sent the message if it doesn't exist
and handles the message with commandHandler.
**/

const User = require(__dirname+"/UserClass.js");
const BuildingConstructor = require(__dirname+"/BuildingConstructorClass.js");
const UpgradeConstructor = require(__dirname+"/UpgradeConstructorClass.js");
const Message = require('discord.js').RichEmbed;

module.exports = class Game {
  constructor() {
    this.functionPrefix = "execute_";
    this.users = {};
    this.constructorB = new BuildingConstructor();
    this.constructorU = new UpgradeConstructor();
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
    if(buildings!=""){
      m.addField("Buildings owned",buildings);
    }
    return m;
  }

  buyBuilding(command,user){
    var m = new Message();
    m.setTitle("Buy building");
    let response="";
    let id_building = parseInt(command[1]);
    var userBuilding = user.getBuilding(id_building);
    if(userBuilding== null) {
      var building = this.constructorB.create(id_building);
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
    m.setTitle("List of buildings");
    for(var w in this.constructorB.elements){
      nbuilding=user.getBuilding(w);
      if(!nbuilding){
        nbuilding= this.constructorB.create(w);
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

  buyUpgrade(user,command){
    var m = new Message();
    m.setTitle("Buy upgrade");
    let response="";
    let id_upgrade = parseInt(command[1]);
    var userUpgrade = user.getUpgrade(id_upgrade);
    if(userUpgrade==null){
      var upgrade= this.constructorU.create(id_upgrade);
    }
    if(upgrade != null){
      if(upgrade.acquire(user)){
        response += "You bought an upgrade "+ id_upgrade+"!";
      } else {
        response += user.mention+" don't have enough cookies..."
      }
    } else {
      response = "This upgrade doesn't exist";
    }
    m.setDescription(response);
    return m;
    }

  displayUpgradeList(user){
    var m = new Message();
    var upgrade = null;
    let response = "";
    var i=1;
    m.setTitle("List of upgrades");
    for(var v in this.constructorU.elements){
      upgrade = user.getUpgrade(v);
      if(!upgrade){
        upgrade= this.constructorU.create(v);
      }
      if(!upgrade.isAcquired()){
        response += i+". "+ upgrade.name +
        " Price: "+ upgrade.cost;
        i++;
        if(user.cookies<upgrade.cost){
          response += " (Not affordable yet)\n";
        } else {
          response += "\n";
        }
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

  execute_upgrade(user, command){
    if(command.length>1){
      return this.buyUpgrade(user, command);
    } else {
      return this.displayUpgradeList(user);
    }
  }

}
