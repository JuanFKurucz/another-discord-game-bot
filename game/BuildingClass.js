'use strict';
module.exports = class Building {
  constructor(id,name,cost,costMultiplier,cps,cpsMultiplier) {
    this.owner=null;
    this.id=id;
    this.name=name;
    this.cost=cost;
    this.costMultiplier=costMultiplier;
    this.cpsMultiplier=cpsMultiplier;
    this.cps=parseFloat(cps);
    this.level=0;
  }

  increase(){
    this.owner.cookies-=this.cost;
    this.level++;
    this.cost *= this.costMultiplier;
  }

  acquire(user){
    var building=user.buildings[this.id];
    if(building){
      return false;
    }
    if(user.cookies>=this.cost){
      this.owner=user;
      user.buildings[this.id]=this;
      this.increase();
      return true;
    }
    return false;
  }

  levelUp(){
    if(this.owner && this.owner.cookies>=this.cost){
      this.increase();
      this.cps *= this.cpsMultiplier;
      return true;
    }
    return false;
  }
}
