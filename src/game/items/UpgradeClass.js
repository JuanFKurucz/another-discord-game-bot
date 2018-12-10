'use strict';

const ShopItem = require("../ShopItemClass.js");

module.exports = class Upgrade extends ShopItem {
  constructor(id,name,cost,multiplierName,multiplier) {
    super(id,name,cost);
    this.applyed=false;
    this.multiplier=multiplier;
    this.multiplierName=multiplierName;
  }

  print(){
    return this.name+" "+this.multiplierName+": "+(parseFloat(this.multiplier)*100)+"%";
  }

  canBeApplied(){
    return this.applyed==false;
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
