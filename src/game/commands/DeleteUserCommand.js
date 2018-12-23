"use strict";

const Language = require("../../Language.js"),
      Command = require("../Command.js"),
      { dbQuery } = require("../../DataBase.js");

module.exports = class ErrorCommand extends Command {
  constructor(id,name) {
    super(id,name);
  }

  async execute(m,user,command){
    console.time();
    new require("../../Bot.js").get().game.deleteUser(user);
    m.setTitle(Language.get("deleteuser_title",user.getLanguage()));
    m.setDescription(Language.get("deleteuser_message",user.getLanguage()));
    console.time();
  }
}
