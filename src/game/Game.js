"use strict";

/**
Game Class, this is where the fun begins.

Every message from Discord is setn to read function, where it creates the player of the user that sent the message if it doesn't exist
and handles the message with commandHandler.
**/

const User = require(__dirname+"/User.js"),
      { dbQuery } = require("../DataBase.js"),
      CommandConstructor = require(__dirname+"/constructors/CommandConstructor.js"),
      Language = require("../Language.js");

module.exports = class Game {
  constructor(prefix) {
    this.users = {};
    this.commandConstructor = new CommandConstructor(prefix);
    this.commands = this.commandConstructor.initCommands();
    this.lanCommands = Language.getCommands();
  }

  async deleteUser(user){
    await dbQuery("DELETE FROM user WHERE id_user='"+user.getId()+"'");
    await dbQuery("DELETE FROM user_building WHERE id_user='"+user.getId()+"'");
    await dbQuery("DELETE FROM user_upgrade WHERE id_user='"+user.getId()+"'");
    delete this.users[user.getId()];
  }

  async loadUsers(){
    const BuildingConstructor = require(__dirname+"/constructors/BuildingConstructor.js"),
          UpgradeConstructor = require(__dirname+"/constructors/UpgradeConstructor.js");
    const buildingConstractor = new BuildingConstructor(),
          upgradeConstractor = new UpgradeConstructor(),
          userResults = await dbQuery("SELECT * FROM user");

    if(userResults !== null){
      let userResultsLength = userResults.length;
      for(let u = 0; u < userResultsLength; u++) {
        let user = new User(userResults[u].id_user);
        user.cookies = userResults[u].cookies;

        let buildingResults=await dbQuery("SELECT id_building, level FROM user_building LEFT JOIN user ON user.id_user = user_building.id_user WHERE user.id_user = "+user.getId());
        if(buildingResults !== null){
          let buildingResultsLength = buildingResults.length;
          for(let b=0; b<buildingResultsLength; b++){
            let building = buildingConstractor.create(buildingResults[b].id_building);
            building.owner = user;
            const level = buildingResults[b].level;
            for(let i=0;i<level;i++){
              building.levelUp(false);
            }
            user.addItem("building",building);
          }
        }

        let upgradeResults=await dbQuery("SELECT id_upgrade FROM user_upgrade LEFT JOIN user ON user.id_user = user_upgrade.id_user WHERE user.id_user = "+user.getId());
        if(upgradeResults !== null){
          let upgradeResultsLength = upgradeResults.length;
          for(let b=0; b<upgradeResultsLength; b++){
            let upgrade = upgradeConstractor.create(upgradeResults[b].id_upgrade);
            upgrade.owner = user;
            upgrade.apply();
            user.addItem("upgrade",upgrade);
          }
        }
        this.users[userResults[u].id_user] = user;
      }
    }
  }

  async saveUsers(){
    for(let u in this.users){
      await dbQuery("UPDATE `user` SET cookies='"+this.users[u].getCookies()+"' WHERE id_user='"+this.users[u].getId()+"'");
    }
  }

  getCommands(){
    return this.commands;
  }

  getCommand(command,user){
    const lan = user.getLanguage();
    let realCommand="command_error";
    if(this.lanCommands.hasOwnProperty(lan) === true && this.lanCommands[lan].hasOwnProperty(command)===true){
      realCommand=this.lanCommands[lan][command];
    }
    return this.commands[realCommand];
  }

  claimCookiesUsers(){
    for(let u in this.users){
      this.users[u].claimCookies();
    }
  }

  async getUser(info){
    if(this.users.hasOwnProperty(info.id) === false){
      this.users[info.id] = new User(info.id);
      await dbQuery("INSERT INTO user SET ?",{
        "id_user":info.id,
        "cookies":0
      });
    }
    this.users[info.id].setInfo(info);
    return this.users[info.id];
  }

  onMessage(user){
    this.claimMessage(user);
    user.resetResponses();
  }

  claimMessage(user){
    user.addCookie();
  }
}
