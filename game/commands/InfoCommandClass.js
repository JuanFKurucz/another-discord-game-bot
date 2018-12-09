'use strict';
const Command = require("../CommandClass.js");

module.exports = class InfoCommand extends Command {
  constructor(id,name,description) {
    super(id,name,description);
  }

  execute(m,user,command){
    let response="You have "+user.cookies+" cookies";
    let buildings="";
    for(var i in user.buildings){
      buildings+=user.buildings[i].name+" (Level: "+user.buildings[i].level+")\n";
    }

    m.setTitle("Info");
    m.setDescription(response);
    if(buildings!=""){
      m.addField("Buildings owned",buildings);
    }
  }
}
