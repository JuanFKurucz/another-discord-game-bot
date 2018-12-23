"use strict";

const ShopItem = require("../ShopItem.js"),
      { dbQuery } = require("../../DataBase.js");

module.exports = class Building extends ShopItem {
  constructor(id,name,cost,costMultiplier,cps,cpsMultiplier) {
    super(id,name,cost);
    this.costMultiplier=costMultiplier;
    this.cpsMultiplier=cpsMultiplier;
    this.cps=parseFloat(cps);
    this.level=0;
  }

  print(){
    return this.getName()+" (Level: "+this.level+") CPS: "+this.cps;
  }

  getLevel(){
    return this.level;
  }

  getCps(){
    return this.cps;
  }

  getDataBaseObject(user){
    let o = {};
    o["id_"+this.constructor.name.toLowerCase()]=this.id;
    o["id_user"]=user.getId();
    o["level"]=this.level;
    return o;
  }

  nextLevelInfo(){
    const response = {
      level:this.level+1,
      cost:this.cost,
      costMultiplier:this.costMultiplier,
      cps:this.cps,
      cpsMultiplier:this.cpsMultiplier
    };
    if(this.getOwner() !== null){
      response.cps *= this.cpsMultiplier;
    }
    return response;
  }

  apply(reduce){
    this.level++;
    if(reduce){
      this.cost *= this.costMultiplier;
    }
    this.cps *= this.cpsMultiplier;
    return true;
  }

  async levelUp(reduce=true){
    const owner = this.getOwner();
    if((owner !== null && (this.canPurchase(owner) === true) || reduce === false)){
      this.apply(reduce);
      if(reduce === true){
        await dbQuery("UPDATE user_"+this.constructor.name.toLowerCase() + " SET ? WHERE id_user = '"+owner.getId()+"' AND id_"+this.constructor.name.toLowerCase()+"= "+this.getId(),{"level":this.getLevel()});
      }
      return true;
    }
    return false;
  }
}
