'use strict';
const { dbQuery } = require("../DataBaseClass.js");
module.exports = class ShopItem {
  constructor(id,name,cost) {
    this.owner=null;
    this.id=id;
    this.name=name;
    this.cost=cost;
  }

  print(){
    return this.name;
  }

  apply(){
    //override
  }

  getName(){
    return this.name;
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
    return user.cookies>=this.cost;
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
    if(!this.owner.addItem(this.constructor.name,this)){
      return false;
    }
    this.owner.cookies-=this.cost;
    this.apply();

    await dbQuery("INSERT INTO user_"+this.constructor.name.toLowerCase() + " SET ?",this.getDataBaseObject(user));
  }

  async acquire(user){
    if(this.canPurchase(user)){
      if(user.getItem(this.constructor.name,this.id) === null){
        await this.purchase(user);
      } else {
        await this.levelUp();
      }
      return true;
    }
    return false;
  }
}
