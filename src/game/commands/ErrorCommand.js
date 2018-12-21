'use strict';
const Command = require("../Command.js");

module.exports = class ErrorCommand extends Command {
  constructor(id,name) {
    const description = "Default error message for unknown commands";
    super(id,name,description);
  }

  async execute(m,user,command){
    console.performance();
    const prefix = new require("../../Bot.js").get().getPrefix();
    m.setTitle("Unknown command");
    m.setDescription("Please write "+prefix+"help to see the command list");
    console.performance();
  }
}
