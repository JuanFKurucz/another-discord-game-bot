'use strict';
const Language = require("../../Language.js"),
      Command = require("../Command.js");

module.exports = class HelpCommand extends Command {
  constructor(id,name) {
    super(id,name);
  }

  async execute(m,user,command){
    console.time();
    const bot = require("../../Bot.js").get(),
        commandList = bot.game.getCommands();

    m.setTitle(Language.get("help_title",user.getLanguage()));
    m.setDescription(Language.get("help_message",user.getLanguage()));
    for(let i in commandList){
      m.addField(
        bot.getPrefix()+commandList[i].getName(user.getLanguage()),
        commandList[i].getDescription(user.getLanguage()).format(bot.getPrefix(),commandList[i].getName())
      );
    }
    console.time();
  }
}
