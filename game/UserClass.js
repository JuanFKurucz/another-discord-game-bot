'use strict';
module.exports = class User {
  constructor(id) {
    this.mention="<@!"+id+">";
    this.id=id;
    this.cookies = 0;
    this.buildings={};
  }

  claimCookies(){
    for(var i in this.buildings){
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
