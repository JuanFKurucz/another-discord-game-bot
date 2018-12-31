"use strict";

const Constructor = require("../Constructor.js"),
      Upgrade = require("../items/Upgrade.js");

module.exports = class UpgradeConstructor extends Constructor {
  constructor(){
    super("Upgrade",{
      "1":{
        name:"Building Booster",
        cost:250,
        multiplierName:"buildingMultiplier",
        multiplier:0.1
      },
      "2":{
        name:"Selfmade Booster",
        cost:500,
        multiplierName:"cpmMultiplier",
        multiplier:0.1
      },
      "3":{
        name:"Cost reduction",
        cost:1000,
        multiplierName:"buildingCost",
        multiplier:-0.1
      }
    });
  }

  createObject(id,upgradeInfo){
    return new Upgrade(
      id,
      upgradeInfo.name,
      upgradeInfo.cost,
      upgradeInfo.multiplierName,
      upgradeInfo.multiplier
    );
  }
};
