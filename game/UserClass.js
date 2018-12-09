'use strict';
module.exports = class User {
  constructor(id) {
    this.mention="<@!"+id+">";
    this.id=id;
    this.cookies = 0;
    this.cpm = 1;

    this.multipliers={
      "cpmMultiplier":1,
      "buildingMultiplier":1,
      "buildingCost":1
    };

    this.buildings={};
    this.upgrades={};
    this.info=null;
  }

  setInfo(info){
    this.info=info;
  }

  claimCookies(){
    for(var i in this.buildings){
      this.cookies+=(parseFloat(this.buildings[i].cps))*this.multipliers["buildingMultiplier"];
    }
  }

  addCookie(){
    this.cookies+=this.cpm*this.multipliers["cpmMultiplier"];
  }

  getBuilding(id){
    var building = this.buildings[id];
    if(building){
      return building;
    }
    return null;
  }

  getUpgrade(id){
    var upgrade = this.upgrades[id];
    if(upgrade){
      return upgrade;
    }
    return null;
  }

  addBuilding(building){
    this.buildings[building.id]=building;
  }

  addUpgrade(upgrade){
    this.upgrades[upgrade.id]=upgrade;
  }
}
