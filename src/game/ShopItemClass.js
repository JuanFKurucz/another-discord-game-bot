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
    let o = {};
    o["id_"+this.constructor.name.toLowerCase()]=this.id;
    o["id_user"]=user.getId();
    return o;
  }

  async acquire(user){
    var item=user["get"+this.constructor.name](this.id);
    if(item){
      return false;
    }
    if(this.canPurchase(user)){
      this.owner=user;
      user["add"+this.constructor.name](this);
      this.owner.cookies-=this.cost;
      this.apply();

      await dbQuery("INSERT INTO user_"+this.constructor.name.toLowerCase() + " SET ?",this.getDataBaseObject(user));

      return true;
    }
    return false;
  }
}
