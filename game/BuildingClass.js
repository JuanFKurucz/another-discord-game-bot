var Building = class {
  constructor(id,name,cost,costMultiplier,cps,cpsMultiplier) {
    this.id=id;
    this.name=name;
    this.cost=cost;
    this.costMultiplier=costMultiplier;
    this.cpsMultiplier=cpsMultiplier;
    this.cps=parseFloat(cps);
  }

  acquire(user){
    if(user.cookies>=this.cost){
      user.cookies-=this.cost;
      user.buildings.push(this);
      return true;
    }
    return false;
  }
}

module.exports = {
  Building:Building
}
