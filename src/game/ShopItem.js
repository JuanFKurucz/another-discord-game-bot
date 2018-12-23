"use strict";
const Language = require("../Language.js"),
      { dbQuery } = require("../DataBase.js");

module.exports = class ShopItem {
  constructor(id,name,cost) {
    this.owner=null;
    this.id=id;
    this.name=name;
    this.cost=cost;
  }

  print(){
    return this.getName();
  }

  apply(){
    //override
  }

  getName(lan){
    return Language.get("item_"+this.name.toLowerCase().split(" ").join(""),lan,{"style":"camelcase"});
  }

  getId(){
    return this.id;
  }

  getCost(){
    return this.cost;
  }

  getOwner(){
    return this.owner;
  }

  canPurchase(user){
    return parseFloat(user.cookies) >= parseFloat(this.cost);
  }

  getDataBaseObject(user){
    const o = {};
    o["id_"+this.constructor.name.toLowerCase()]=this.id;
    o["id_user"]=user.getId();
    return o;
  }

  async levelUp(){
    return false;
  }

  async purchase(user){
    this.owner=user;
    if(this.owner.addItem(this.constructor.name,this) === false || this.apply() === false){
      this.owner.removeItem(this.constructor.name,this);
      this.owner=null;
      return false;
    }
    this.owner.cookies-=this.cost;
    await dbQuery("INSERT INTO user_"+this.constructor.name.toLowerCase() + " SET ?",this.getDataBaseObject(user));
    return true;
  }

  async acquire(user){
    if(this.canPurchase(user) === true){
      const item = user.getItem(this.constructor.name,this.id);
      if(item === null){
        return await this.purchase(user);
      }
      return await item.levelUp();
    }
    return false;
  }
}
