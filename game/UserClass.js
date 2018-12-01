var User = class {
  constructor(id) {
    this.mention="<@!"+id+">";
    this.id=id;
    this.cookies = 0;
    this.buildings={};
  }

  claimCookies(){
    for(var i=0;i<this.buildings.length;i++){
      this.cookies+=parseFloat(this.buildings[i].cps);
    }
  }

  getBuilding(id){
    var building = this.buildings[id];
    if(building){
      return building;
    }
    return null;
  }
}

module.exports = {
  User:User
}
