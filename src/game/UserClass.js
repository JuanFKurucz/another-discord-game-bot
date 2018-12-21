'use strict';
module.exports = class User {
  constructor(id) {
    this.mention="<@!"+id+">";
    this.id=id;
    this.cookies = 100;
    this.cpm = 1;

    this.multipliers={
      "cpmMultiplier":1,
      "buildingMultiplier":1,
      "buildingCost":1
    };
    this.items={
      "building":{},
      "upgrade":{}
    };
    this.info=null;
  }

  getId(){
    return this.id;
  }

  getCookies(){
    return this.cookies;
  }

  setInfo(info){
    this.info=info;
  }

  claimCookies(){
    this.cookies += this.getTotalCps();
  }

  getTotalCps(){
    let sum=0;

    for(let i in this.items["building"]){
      sum+=(parseFloat(this.items["building"][i].getCps()))*this.multipliers["buildingMultiplier"];
    }

    return sum;
  }

  getTotalCpm(){
      return this.cpm*this.multipliers["cpmMultiplier"];
  }

  addCookie(){
    this.cookies+=this.getTotalCpm();
  }

  getItem(type,id){
    const typeName=type.toLowerCase();
    if(typeof this.items[typeName] !== "undefined" && typeof this.items[typeName][id] !== "undefined"){
      return this.items[typeName][id];
    }
    return null;
  }

  addItem(type,item){
    const typeName=type.toLowerCase();
    if(typeof this.items[typeName] !== "undefined"){
      this.items[typeName][item.getId()]=item;
      return true;
    }
    return false;
  }
}
