'use strict';
const Command = require(__dirname+"/CommandClass.js");

module.exports = class ErrorCommand extends Command {
  constructor(id,name) {
    super(id,name);
  }

  execute(m,user,command){
    m.setTitle("Unknown command");
    m.setDescription("Please write help to see the command list.");
  }
}
