var Building = class {
  constructor(id,name,cost,cps) {
    this.id=id;
    this.name=name;
    this.cost=cost;
    this.cps=parseFloat(cps);
  }

  acquire(user){
    if(user.cookies>=this.cost){
      user.cookies-=this.cost;
      user.buildings.push(this);
    }
  }
}

module.exports = {
  Building:Building
}
