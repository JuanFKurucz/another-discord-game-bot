'use strict';

const ShopItem = require("../ShopItemClass.js");

module.exports = class Building extends ShopItem {
  constructor(id,name,cost,costMultiplier,cps,cpsMultiplier) {
    super(id,name,cost);
    this.costMultiplier=costMultiplier;
    this.cpsMultiplier=cpsMultiplier;
    this.cps=parseFloat(cps);
    this.level=0;
  }

  print(){
    return this.name+" (Level: "+this.level+") CPS: "+this.cps;
  }

  getLevel(){
    return this.level;
  }

  getCps(){
    return this.cps;
  }

  nextLevelInfo(){
    var response = {
      level:this.level+1,
      name:this.name,
      cost:this.cost,
      costMultiplier:this.costMultiplier,
      cps:this.cps,
      cpsMultiplier:this.cpsMultiplier
    };
    if(this.owner!==null){
      response.cps *= this.cpsMultiplier;
    }
    return response;
  }

  apply(){
    this.level++;
    this.cost *= this.costMultiplier;
  }

  levelUp(){
    if(this.owner && this.canPurchase(this.owner)){
      this.apply();
      this.cps *= this.cpsMultiplier;
      return true;
    }
    return false;
  }
}
