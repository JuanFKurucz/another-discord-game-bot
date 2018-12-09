'use strict';
const Command = require(__dirname+"/CommandClass.js");
const UpgradeConstructor = require("../UpgradeConstructorClass.js");

module.exports = class UpgradeCommand extends Command {
  constructor(id,name) {
    super(id,name);
    this.constructor = new UpgradeConstructor();
  }
  buyUpgrade(m,user,command){
    m.setTitle("Buy upgrade");
    let response="";
    let id_upgrade = parseInt(command[1]);
    var userUpgrade = user.getUpgrade(id_upgrade);
    if(userUpgrade==null){
      var upgrade= this.constructor.create(id_upgrade);
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
  }

  displayUpgradeList(m,user){
    var upgrade = null;
    let response = "";
    var i=1;
    m.setTitle("List of upgrades");
    for(var v in this.constructor.elements){
      upgrade = user.getUpgrade(v);
      if(!upgrade){
        upgrade= this.constructor.create(v);
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
  }

  execute(m,user,command){
    if(command.length>1){
      this.buyUpgrade(m, user, command);
    } else {
      this.displayUpgradeList(m, user);
    }
  }
}
