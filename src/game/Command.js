'use strict';

const Language = require("../Language.js");

module.exports = class Command {
  constructor(id,name,description="") {
    this.id=id;
    this.name=name;
    this.description=description;
  }

  getName(lan){
    return Language.get("command_"+this.name,{
      "default":this.name,
      "lan":lan,
      "style":"lower"
    });
  }

  getId(){
    return this.id;
  }

  getDescription(lan){
    return Language.get("command_"+this.name.toLowerCase()+"_description",{"lan":lan}).format(
      this.getName(),this.botPrefix
    );
  }

  execute(m,user,command){
    //to implement
  }
}
