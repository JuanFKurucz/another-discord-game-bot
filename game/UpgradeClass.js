var Upgrade = class {
  constructor(id,name,cost,multiplierName,multiplier) {
    this.owner=null;
    this.applyed=false;
    this.id=id;
    this.name=name;
    this.cost=cost;
    this.multiplier=multiplier;
    this.multiplierName=multiplierName;
  }

  acquire(user){
    if(user.cookies>=this.cost){
      this.owner=user;
      this.owner.cookies-=this.cost;
      this.owner.upgrades.push(this);
      this.applyEffect();
    }
  }

  isAcquired(){
    return this.owner !== null;
  }

  canBeApplied(){
    return this.isAcquired() && this.applyed==false;
  }

  applyEffect(){
    if(this.canBeApplied()){
      this.applyed=true;
      this.owner.multipliers[this.multiplierName]+=this.multiplier;
    }
  }
}


module.exports = {
  UpgradeCPSMultiplier:UpgradeCPSMultiplier
}
