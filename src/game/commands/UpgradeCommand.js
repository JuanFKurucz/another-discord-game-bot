"use strict";

const Command = require("../Command.js"),
      UpgradeConstructor = require("../constructors/UpgradeConstructor.js");

module.exports = class UpgradeCommand extends Command {
  constructor(id,name) {
    super(id,name);
    this.constructor = new UpgradeConstructor();
  }

  async buyUpgrade(m,user,command){
    const id_upgrade = parseInt(command[1]),
          userUpgrade = user.getItem(this.constructor.getObjectName(),id_upgrade),
          upgrade = (userUpgrade === null) ? this.constructor.create(id_upgrade) : null;

    let response = "";

    if(upgrade !== null){
      response = await upgrade.acquire(user);
    } else {
      response = "upgrade_noexists";
    }

    m.setTitle("upgrade_buy");
    m.setDescription(response);
  }

  displayUpgradeList(m,user){
    let userUpgrade = null,
        upgrade = null,
        tmp = "",
        i=1;

    m.setTitle("upgrade_list");
    for(let v in this.constructor.elements){
      userUpgrade = user.getItem(this.constructor.getObjectName(),v);
      if(userUpgrade === null){

        upgrade = this.constructor.create(v);
        if(upgrade.canPurchase(user) === false){
          tmp = " (^_notaffordable^)";
        } else {
          tmp = "";
        }

        m.addField(
          i+". ^"+upgrade.getName()+"^" + tmp,
          " ^_price^: "+ upgrade.cost
        );
        i++;
      }
    }
  }

  async execute(m,user,command){
    console.time();
    if(command.length>1){
      await this.buyUpgrade(m,user,command);
    } else {
      await this.displayUpgradeList(m,user);
    }
    console.time();
  }
}
