'use strict';
const Command = require("../CommandClass.js");
const { dbQuery } = require("../../DataBaseClass.js");

module.exports = class ErrorCommand extends Command {
  constructor(id,name,description) {
    super(id,name,description);
  }

  async execute(m,user,command){
    new require("../../BotClass.js").get().game.deleteUser(user);
    m.setTitle("Delete user");
    m.setDescription("User deleted successfully");
  }
}
