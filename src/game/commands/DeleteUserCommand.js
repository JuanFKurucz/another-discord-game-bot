"use strict";

const Command = require("../Command.js"),
      { dbQuery } = require("../../DataBase.js");

module.exports = class ErrorCommand extends Command {
  constructor(id,name) {
    super(id,name);
  }

  async execute(m,user,command){
    console.time();
    new require("../../Bot.js").get().game.deleteUser(user);
    m.setTitle("deleteuser_title");
    m.setDescription("deleteuser_message");
    console.time();
  }
};
