'use strict';
const Command = require("../CommandClass.js");

module.exports = class ErrorCommand extends Command {
  constructor(id,name,description) {
    super(id,name,description);
  }

  execute(m,user,command){
    m.setTitle("Unknown command");
    m.setDescription("Please write !help to see the command list"); //prefix of bot should come to here
  }
}
