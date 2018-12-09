'use strict';

const Constructor = require("../ConstructorClass.js");

module.exports = class CommandConstructor extends Constructor {
  constructor(){
    super({
      "-1":{
        name:"error",
        description:"Default error message for unknown commands",
        constructor:require(__dirname+"/ErrorCommandClass.js")
      },
      "0":{
        name:"help",
        description:"Use to retrieve list of commands",
        constructor:require(__dirname+"/HelpCommandClass.js")
      },
      "1":{
        name:"info",
        description:"Use to retrieve user profile and information",
        constructor:require(__dirname+"/InfoCommandClass.js")
      },
      "2":{
        name:"buy",
        description:"Use to buy structures that will give you CPS\nThrow *{prefix}{name}* to see the list of buildings\nThrow *{prefix}{name} number* to buy a building",
        constructor:require(__dirname+"/BuyCommandClass.js")
      },
      "3":{
        name:"upgrade",
        description:"Use to upgrades that will boost you in different ways\nThrow *{prefix}{name}* to see the list of upgrades\nThrow *{prefix}{name} number* to buy an upgrade",
        constructor:require(__dirname+"/UpgradeCommandClass.js")
      }
    });
  }

  initCommands(){
    let commands = {},
        object = null;

    for(let e in this.elements){
      object=this.create(e);
      commands[object.getName()]=object;
    }

    return commands;
  }

  createObject(id,commandInfo){
    return new commandInfo.constructor(
      id,
      commandInfo.name,
      commandInfo.description
    );
  }
}
