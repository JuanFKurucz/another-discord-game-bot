'use strict';

module.exports = class Command {
  constructor(id,name,description="") {
    this.id=id;
    this.name=name;
    this.description=description;
  }

  getName(){
    return this.name;
  }

  getId(){
    return this.id;
  }

  getDescription(){
    return this.description;
  }

  execute(m,user,command){
    //to implement
  }
}
