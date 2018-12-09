'use strict';
const Command = require(__dirname+"/CommandClass.js");
const Message = require('discord.js').RichEmbed;

module.exports = class InfoCommand extends Command {
  constructor(id,name) {
    super(id,name);
  }

  execute(user,command){
    var m = new Message();
    m.setTitle("Info");
    let response="You have "+user.cookies+" cookies";
    m.setDescription(response);
    let buildings="";
    for(var i in user.buildings){
      buildings+=user.buildings[i].name+" (Level: "+user.buildings[i].level+")\n";
    }
    if(buildings!=""){
      m.addField("Buildings owned",buildings);
    }
    return m;
  }
}
