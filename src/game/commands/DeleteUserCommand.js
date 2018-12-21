'use strict';
const Command = require("../Command.js");
const { dbQuery } = require("../../DataBase.js");

module.exports = class ErrorCommand extends Command {
  constructor(id,name) {
    const description = "Removes yourself from the game database";
    super(id,name,description);
  }

  async execute(m,user,command){
    console.performance();
    new require("../../Bot.js").get().game.deleteUser(user);
    m.setTitle("Delete user");
    m.setDescription("User deleted successfully");
    console.performance();
  }
}
