var Building = class {
  constructor(id,name,cost,costMultiplier,cps,cpsMultiplier) {
    this.id=id;
    this.name=name;
    this.cost=cost;
    this.costMultiplier=costMultiplier;
    this.cpsMultiplier=cpsMultiplier;
    this.cps=parseFloat(cps);
    this.level=1;
  }

  acquire(user){
    if(user.cookies>=this.cost){
      user.cookies-=this.cost;
      user.buildings.push(this);
      return true;
    }
    return false;
  }

  levelUp(){
    if(user.cookies>=this.cost){
      this.level++;
      this.cost *= this.costMultiplier;
      this.cps *= this.cpsMultiplier;
      return true;
    }
    return false;
  }
}

module.exports = {
  Building:Building
}
