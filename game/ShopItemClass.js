'use strict';
module.exports = class ShopItem {
  constructor(id,name,cost) {
    this.owner=null;
    this.id=id;
    this.name=name;
    this.cost=cost;
  }

  apply(){
    //override
  }

  canPurchase(user){
    return user.cookies>=this.cost;
  }

  acquire(user){
    var item=user["get"+this.constructor.name](this.id);
    if(item){
      return false;
    }
    if(this.canPurchase(user)){
      this.owner=user;
      user["add"+this.constructor.name](this);
      this.owner.cookies-=this.cost;
      this.apply();
      return true;
    }
    return false;
  }
}
