'use strict';
const Command = require("../Command.js");

module.exports = class HelpCommand extends Command {
  constructor(id,name) {
    const description = "Use to retrieve list of commands";
    super(id,name,description);
  }

  async execute(m,user,command){
    console.performance();
    const bot = new require("../../Bot.js").get(),
        commandList = bot.game.getCommands();

    m.setTitle("Help");
    m.setDescription("Someone write a description here please.");
    for(let i in commandList){
      m.addField(
        bot.getPrefix()+commandList[i].getName(),
        commandList[i].getDescription().replace(/{name}/g,commandList[i].getName()).replace(/{prefix}/g,bot.getPrefix())
      );
    }
    console.performance();
  }
}
