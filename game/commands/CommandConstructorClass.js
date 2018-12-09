'use strict';

const Constructor = require("../ConstructorClass.js");

module.exports = class CommandConstructor extends Constructor {
  constructor(){
    super({
      "-1":{
        name:"error",
        constructor:require(__dirname+"/ErrorCommandClass.js")
      },
      "1":{
        name:"info",
        constructor:require(__dirname+"/InfoCommandClass.js")
      },
      "2":{
        name:"buy",
        constructor:require(__dirname+"/BuyCommandClass.js")
      },
      "3":{
        name:"upgrade",
        constructor:require(__dirname+"/UpgradeCommandClass.js")
      }
    });
  }

  initCommands(){
    let commands = {};
    let object;
    for(let e in this.elements){
      object=this.create(e);
      commands[object.getName()]=object;
    }
    return commands;
  }

  createObject(id,commandInfo){
    return new commandInfo.constructor(
      id,
      commandInfo.name
    );
  }
}
