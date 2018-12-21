'use strict';

const Constructor = require("../Constructor.js"),
      fs = require('fs');

module.exports = class CommandConstructor extends Constructor {
  constructor(){
    const commandsFolder = "./src/game/commands/",
          files = fs.readdirSync(commandsFolder),
          elements = {},
          namesCheck = {};
    let i=0;

    files.forEach(function(filename) {
      let name = filename.substring(0,filename.lastIndexOf('Command')).toLowerCase();
      if(namesCheck.hasOwnProperty(name) === false){
        elements[i]={
          "name":name,
          "constructor":require("../commands/"+filename)
        };
        namesCheck[name]=true;
        i++;
      } else {
        console.error(name+" already exists as a command. DUPLICATED COMMAND NAME",0);
      }
    });

    super("Command",elements);
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
    return new commandInfo.constructor(id,commandInfo.name);
  }
}