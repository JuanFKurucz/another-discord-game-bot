'use strict';
const Command = require("../CommandClass.js");

module.exports = class ErrorCommand extends Command {
  constructor(id,name,description) {
    super(id,name,description);
  }

  execute(m,user,command){
    let prefix = new require("../../BotClass.js").get().getPrefix();
    m.setTitle("Unknown command");
    m.setDescription("Please write "+prefix+"help to see the command list");
  }
}
