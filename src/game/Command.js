"use strict";

module.exports = class Command {
  constructor(id,name,description="") {
    this.id=id;
    this.name=name;
    this.description=description;
  }

  getName(){
    return "command_"+this.name;
  }

  getId(){
    return this.id;
  }

  getDescription(){
    return "command_"+this.name.toLowerCase()+"_description";
  }

  execute(m,user,command){
    //to implement
    console.log(m,user,command);
  }
};
