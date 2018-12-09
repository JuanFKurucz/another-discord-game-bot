'use strict';

const ShopItem = require(__dirname+"/ShopItemClass.js");

module.exports = class Upgrade extends ShopItem {
  constructor(id,name,cost,multiplierName,multiplier) {
    super(id,name,cost);
    this.applyed=false;
    this.multiplier=multiplier;
    this.multiplierName=multiplierName;
  }

  isAcquired(){
    return this.owner !== null;
  }

  canBeApplied(){
    return !this.isAcquired() && this.applyed==false;
  }

  apply(){
    if(this.canBeApplied()){
      this.applyed=true;
      this.owner.multipliers[this.multiplierName]+=this.multiplier;
      return true;
    }
    return false;
  }
}
