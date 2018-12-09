'use strict';
const Command = require(__dirname+"/CommandClass.js");

module.exports = class HelpCommand extends Command {
  constructor(id,name,description) {
    super(id,name,description);
  }

  execute(m,user,command){
    let bot = new require("../../BotClass.js").get(),
        commandList = bot.game.getCommands();

    m.setTitle("Help");
    m.setDescription("Someone write a description here please.");
    for(var i in commandList){
      m.addField(
        bot.getPrefix()+commandList[i].getName(),
        commandList[i].getDescription().replace(/{name}/g,commandList[i].getName()).replace(/{prefix}/g,bot.getPrefix())
      );
    }
  }
}
