var User = class {
  constructor(id) {
    this.id=id;
    this.cookies = 0;
    this.buildings=[];
  }

  claimCookies(){
    for(var i=0;i<this.buildings.length;i++){
      this.cookies+=this.buildings[i].cps;
    }
  }
}

module.exports = {
  User:User
}
