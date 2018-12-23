"use strict";

const ShopItem = require("../ShopItem.js");

module.exports = class Upgrade extends ShopItem {
  constructor(id,name,cost,multiplierName,multiplier) {
    super(id,name,cost);
    this.applyed=false;
    this.multiplier=multiplier;
    this.multiplierName=multiplierName;

    this.responses={
      "acquire":{"text":"upgrade_acquire","data":this.id}
    };
  }

  print(){
    return "^"+this.name+"^ ^"+this.multiplierName+"^: "+(parseFloat(this.multiplier)*100)+"%";
  }

  printBuy(user){
    const tmp = (this.canPurchase(user)===true) ? "" : " (^_notaffordable^)";

    return {
      "title":"^"+this.getName()+"^" + tmp,
      "description":" ^_price^: "+ this.cost+" ^"+this.multiplierName+"^: "+(parseFloat(this.multiplier)*100)+"%"
    };
  }

  canBeApplied(){
    return this.applyed === false;
  }

  apply(){
    if(this.canBeApplied() === true){
      this.applyed=true;
      this.getOwner().multipliers[this.multiplierName]+=this.multiplier;
      return true;
    }
    return false;
  }

  canAcquire(user){
    return user.getItem(this.constructor.name,this.id) === null;
  }
}
