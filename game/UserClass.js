'use strict';
module.exports = class User {
  constructor(id) {
    this.mention="<@!"+id+">";
    this.id=id;
    this.cookies = 0;
    this.cpm = 1;
    this.buildings={};
    this.info=null;
  }

  setInfo(info){
    this.info=info;
  }

  claimCookies(){
    for(var i in this.buildings){
      this.cookies+=parseFloat(this.buildings[i].cps);
    }
  }

  addCookie(){
    this.cookies+=this.cpm;
  }

  getBuilding(id){
    var building = this.buildings[id];
    if(building){
      return building;
    }
    return null;
  }
}
