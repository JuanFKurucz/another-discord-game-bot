'use strict';

const Constructor = require("../ConstructorClass.js");

module.exports = class CommandConstructor extends Constructor {
  constructor(){
    super({
      "-2":{
        name:"deleteuser",
        description:"Removes yourself from the game database",
        constructor:require("../commands/DeleteUserCommandClass.js")
      },
      "-1":{
        name:"error",
        description:"Default error message for unknown commands",
        constructor:require("../commands/ErrorCommandClass.js")
      },
      "0":{
        name:"help",
        description:"Use to retrieve list of commands",
        constructor:require("../commands/HelpCommandClass.js")
      },
      "1":{
        name:"info",
        description:"Use to retrieve user profile and information",
        constructor:require("../commands/InfoCommandClass.js")
      },
      "2":{
        name:"buy",
        description:"Use to buy structures that will give you CPS\nThrow *{prefix}{name}* to see the list of buildings\nThrow *{prefix}{name} number* to buy a building",
        constructor:require("../commands/BuyCommandClass.js")
      },
      "3":{
        name:"upgrade",
        description:"Use to upgrades that will boost you in different ways\nThrow *{prefix}{name}* to see the list of upgrades\nThrow *{prefix}{name} number* to buy an upgrade",
        constructor:require("../commands/UpgradeCommandClass.js")
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
