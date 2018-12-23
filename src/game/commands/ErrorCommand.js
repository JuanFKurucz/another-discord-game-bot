'use strict';
const Language = require("../../Language.js"),
      Command = require("../Command.js");

module.exports = class ErrorCommand extends Command {
  constructor(id,name) {
    super(id,name);
  }

  async execute(m,user,command){
    console.time();
    const prefix = new require("../../Bot.js").get().getPrefix();
    m.setTitle(Language.get("error_title",user.getLanguage()));
    m.setDescription(Language.get("error_message",user.getLanguage()).format(prefix,Language.get("command_help",user.getLanguage(),{"style":"lower"})));
    console.time();
  }
}
