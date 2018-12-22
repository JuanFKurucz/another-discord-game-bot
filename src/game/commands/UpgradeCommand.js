'use strict';
const Language = require("../../Language.js"),
      Command = require("../Command.js"),
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

    let response="";

    if(upgrade !== null){
      if(await upgrade.acquire(user) === true){
        response = Language.get("upgrade_acquire",{"lan":user.getLanguage()}).format(id_upgrade);
      } else {
        response = Language.get("_nocookies",{"lan":user.getLanguage()}).format(user.mention);
      }
    } else {
      response = Language.get("upgrade_noexists",{"lan":user.getLanguage()});
    }

    m.setTitle(Language.get("upgrade_buy",{"lan":user.getLanguage()}));
    m.setDescription(response);
  }

  displayUpgradeList(m,user){
    let userUpgrade = null,
        upgrade = null,
        tmp = "",
        i=1;

    m.setTitle(Language.get("upgrade_list",{"lan":user.getLanguage()}));
    for(let v in this.constructor.elements){
      userUpgrade = user.getItem(this.constructor.getObjectName(),v);
      if(userUpgrade === null){

        upgrade = this.constructor.create(v);
        if(upgrade.canPurchase(user) === false){
          tmp = " ("+Language.get("_notaffordable",{"lan":user.getLanguage()})+")";
        } else {
          tmp = "";
        }

        m.addField(
          i+". "+upgrade.getName(user.getLanguage()) + tmp,
          " "+Language.get("_price",{"lan":user.getLanguage()})+": "+ upgrade.cost
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
