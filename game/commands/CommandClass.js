'use strict';

module.exports = class Command {
  constructor(id,name) {
    this.id=id;
    this.name=name;
  }

  getName(){
    return this.name;
  }

  getId(){
    return this.id;
  }

  execute(user,command){
    //to implement
  }
}
