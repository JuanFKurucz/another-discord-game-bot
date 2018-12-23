"use strict";
const { dbQuery } = require("../DataBase.js");

module.exports = class ShopItem {
  constructor(id,name,cost) {
    this.owner=null;
    this.id=id;
    this.name=name;
    this.cost=cost;
    this.response=null;
    this.responses={
    };
  }

  print(){
    return this.getName();
  }

  apply(){
    //override
  }

  getName(){
    return "item_"+this.name.toLowerCase().split(" ").join("");
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
    this.response={"text":"_nocookies","data":user.mention};
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
    this.response=this.responses["acquire"];
  }

  async acquire(user){
    if(this.canPurchase(user) === true){
      const item = user.getItem(this.constructor.name,this.id);
      if(item === null){
        await this.purchase(user);
      } else {
        await item.levelUp();
      }
    }
    return this.response;
  }
}
