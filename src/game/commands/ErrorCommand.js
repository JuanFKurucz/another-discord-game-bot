'use strict';
const Language = require("../../Language.js"),
      Command = require("../Command.js");

module.exports = class ErrorCommand extends Command {
  constructor(id,name) {
    super(id,name);
  }

  async execute(m,user,command){
    console.performance();
    const prefix = new require("../../Bot.js").get().getPrefix();
    m.setTitle(Language.get("error_title",{"lan":user.getLanguage()}));
    m.setDescription(Language.get("error_message",{"lan":user.getLanguage()}).format(prefix,Language.get("command_help",{"style":"lower","lan":user.getLanguage()})));
    console.performance();
  }
}
