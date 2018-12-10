'use strict';

/**
Game Class, this is where the fun begins.

Every message from Discord is setn to read function, where it creates the player of the user that sent the message if it doesn't exist
and handles the message with commandHandler.
**/

const User = require(__dirname+"/UserClass.js");
const { dbQuery } = require("../DataBaseClass.js");
const CommandConstructor = require(__dirname+"/constructors/CommandConstructorClass.js");

module.exports = class Game {
  constructor() {
    this.users = {};
    this.commandConstructor = new CommandConstructor();
    this.commands = this.commandConstructor.initCommands();
  }

  async deleteUser(user){
    await dbQuery("DELETE FROM user WHERE id_user='"+user.getId()+"'");
    await dbQuery("DELETE FROM user_building WHERE id_user='"+user.getId()+"'");
    await dbQuery("DELETE FROM user_upgrade WHERE id_user='"+user.getId()+"'");
    delete this.users[user.getId()];
  }

  async loadUsers(){
    const BuildingConstructor = require(__dirname+"/constructors/BuildingConstructorClass.js"),
          UpgradeConstructor = require(__dirname+"/constructors/UpgradeConstructorClass.js");
    let userResults=await dbQuery("SELECT * FROM user"),
        buildingResults=null,
        upgradeResults=null,
        user=null,
        building=null,
        upgrade=null,
        buildingConstractor = new BuildingConstructor(),
        upgradeConstractor = new UpgradeConstructor();
    if(userResults){
      for(var ur in userResults){
        user = new User(userResults[ur].id_user);
        user.cookies = userResults[ur].cookies;

        buildingResults=await dbQuery("SELECT id_building, level FROM user_building LEFT JOIN user ON user.id_user = user_building.id_user");
        if(buildingResults){
          for(var br in buildingResults){
            building = buildingConstractor.create(buildingResults[br].id_building);
            building.owner = user;
            for(var i=0;i<buildingResults[br].level;i++){
              building.levelUp();
            }
            user.buildings[buildingResults[br].id_building]=building;
          }
        }
        if(upgradeResults){
          upgradeResults=await dbQuery("SELECT id_upgrade FROM user_upgrade LEFT JOIN user ON user.id_user = user_upgrade.id_user");
          for(var upr in upgradeResults){
            upgrade = upgradeConstractor.create(upgradeResults[upr].id_upgrade);
            upgrade.owner = user;
            upgrade.apply();
            user.upgrades[upgradeResults[upr].id_upgrade] = upgrade;
          }
        }
        this.users[userResults[ur].id_user] = user;
      }
    }
  }

  async saveUsers(){
    for(var u in this.users){
      await dbQuery("UPDATE `user` SET cookies='"+this.users[u].getCookies()+"' WHERE id_user='"+this.users[u].getId()+"'");
    }
  }

  getCommands(){
    return this.commands;
  }

  getCommand(command){
    if(this.commands[command]){
      return this.commands[command];
    } else {
      return null;
    }
  }

  claimCookiesUsers(){
    for(var u in this.users){
      this.users[u].claimCookies();
    }
  }

  async getUser(info){
    if(!this.users.hasOwnProperty(info.id)){
      this.users[info.id] = new User(info.id);
      await dbQuery("INSERT INTO user SET ?",{
        "id_user":info.id,
        "cookies":0
      });
    }
    this.users[info.id].setInfo(info);
    this.claimMessage(this.users[info.id]);
    return this.users[info.id];
  }

  claimMessage(user){
    user.addCookie();
  }
}
