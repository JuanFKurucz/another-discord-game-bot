'use strict';

const ShopItem = require(__dirname+"/ShopItemClass.js");

module.exports = class Building extends ShopItem {
  constructor(id,name,cost,costMultiplier,cps,cpsMultiplier) {
    super(id,name,cost);
    this.costMultiplier=costMultiplier;
    this.cpsMultiplier=cpsMultiplier;
    this.cps=parseFloat(cps);
    this.level=0;
  }

  nextLevelInfo(){
    return {
      level:this.level+1,
      name:this.name,
      cost:this.cost,
      costMultiplier:1.5,
      cps:this.cps*this.cpsMultiplier,
      cpsMultiplier:1.5
    }
  }

  apply(){
    this.level++;
    this.cost *= this.costMultiplier;
  }

  levelUp(){
    if(this.owner && this.canPurchase(this.owner)){
      this.increase();
      this.cps *= this.cpsMultiplier;
      return true;
    }
    return false;
  }
}
