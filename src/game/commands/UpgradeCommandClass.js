'use strict';
const Command = require("../CommandClass.js");
const UpgradeConstructor = require("../constructors/UpgradeConstructorClass.js");

module.exports = class UpgradeCommand extends Command {
  constructor(id,name,description) {
    super(id,name,description);
    this.constructor = new UpgradeConstructor();
  }

  async buyUpgrade(m,user,command){
    const id_upgrade = parseInt(command[1]),
          userUpgrade = user.getItem(this.constructor.getObjectName(),id_upgrade),
          upgrade = (userUpgrade === null) ? this.constructor.create(id_upgrade) : null;

    let response="";

    if(upgrade !== null){
      if(await upgrade.acquire(user) === true){
        response = "You bought an upgrade " + id_upgrade + "!";
      } else {
        response = user.mention + " you don't have enough cookies...";
      }
    } else {
      response = "This upgrade doesn't exist";
    }

    m.setTitle("Buy upgrade");
    m.setDescription(response);
  }

  displayUpgradeList(m,user){
    let userUpgrade = null,
        upgrade = null,
        tmp = "",
        i=1;

    m.setTitle("List of upgrades");
    for(let v in this.constructor.elements){
      userUpgrade = user.getItem(this.constructor.getObjectName(),v);
      if(userUpgrade === null){
        upgrade = this.constructor.create(v);
        if(upgrade.canPurchase(user) === false){
          tmp = " (Not affordable yet)";
        } else {
          tmp = "";
        }

        m.addField(
          i+". "+upgrade.name + tmp,
          " Price: "+ upgrade.cost
        );
        i++;
      }
    }
  }

  async execute(m,user,command){
    console.performance();
    if(command.length>1){
      await this.buyUpgrade(m,user,command);
    } else {
      await this.displayUpgradeList(m,user);
    }
    console.performance();
  }
}
