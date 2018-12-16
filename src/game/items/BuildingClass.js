'use strict';

const ShopItem = require("../ShopItemClass.js");
const { dbQuery } = require("../../DataBaseClass.js");

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

  getDataBaseObject(user){
    let o = {};
    o["id_"+this.constructor.name.toLowerCase()]=this.id;
    o["id_user"]=user.getId();
    o["level"]=this.level;
    return o;
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

  apply(reduce){
    this.level++;
    if(reduce){
      this.cost *= this.costMultiplier;
    }
    this.cps *= this.cpsMultiplier;
  }

  async levelUp(reduce=true){
    if(this.owner && (this.canPurchase(this.owner)|| !reduce)){
      this.apply(reduce);
      await dbQuery("UPDATE user_"+this.constructor.name.toLowerCase() + " SET ? WHERE id_user = '"+this.owner.getId()+"' AND id_"+this.constructor.name.toLowerCase()+"= "+this.id,{"level":this.level});
      return true;
    }
    return false;
  }
}
