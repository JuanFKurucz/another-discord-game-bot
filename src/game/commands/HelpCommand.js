'use strict';
const Language = require("../../Language.js"),
      Command = require("../Command.js");

module.exports = class HelpCommand extends Command {
  constructor(id,name) {
    super(id,name);
  }

  async execute(m,user,command){
    console.performance();
    const bot = require("../../Bot.js").get(),
        commandList = bot.game.getCommands();

    m.setTitle(Language.get("help_title",{"lan":user.getLanguage()}));
    m.setDescription(Language.get("help_message",{"lan":user.getLanguage()}));
    for(let i in commandList){
      m.addField(
        bot.getPrefix()+commandList[i].getName(),
        commandList[i].getDescription(user.getLanguage()).replace(/{name}/g,commandList[i].getName()).replace(/{prefix}/g,bot.getPrefix())
      );
    }
    console.performance();
  }
}
