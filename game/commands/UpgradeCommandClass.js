'use strict';
const Command = require(__dirname+"/CommandClass.js");
const UpgradeConstructor = require("../UpgradeConstructorClass.js");

module.exports = class UpgradeCommand extends Command {
  constructor(id,name,description) {
    super(id,name,description);
    this.constructor = new UpgradeConstructor();
  }
  buyUpgrade(m,user,command){
    let response="",
        id_upgrade = parseInt(command[1]),
        userUpgrade = user.getUpgrade(id_upgrade),
        upgrade=null;

    if(userUpgrade==null){
      upgrade=this.constructor.create(id_upgrade);
    }
    if(upgrade != null){
      if(upgrade.acquire(user)){
        response = "You bought an upgrade "+ id_upgrade+"!";
      } else {
        response = user.mention+" don't have enough cookies..."
      }
    } else {
      response = "This upgrade doesn't exist";
    }

    m.setTitle("Buy upgrade");
    m.setDescription(response);
  }

  displayUpgradeList(m,user){
    let upgrade = null,
        response = "",
        i=1;

    for(var v in this.constructor.elements){
      upgrade = user.getUpgrade(v);
      if(!upgrade){
        upgrade= this.constructor.create(v);
      }
      if(!upgrade.isAcquired()){
        response += i+". "+ upgrade.name +
        " Price: "+ upgrade.cost;
        if(upgrade.canPurchase(user)){
          response += " (Not affordable yet)";
        }
        response += "\n";
        i++;
      }
    }

    m.setTitle("List of upgrades");
    m.setDescription(response);
  }

  execute(m,user,command){
    if(command.length>1){
      this.buyUpgrade(m,user,command);
    } else {
      this.displayUpgradeList(m,user);
    }
  }
}
