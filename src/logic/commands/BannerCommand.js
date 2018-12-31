"use strict";

const Command = require("../Command.js");

module.exports = class BannerCommand extends Command {
  constructor(id,name) {
    super(id,name);
    this.permission=1;
  }

  async doExecute(m,user,command){
    console.time();
    command.shift();
    command = command.join(" ");
    user.messageBanner=true;
    m.setTitle(command);
    console.time();
  }
};
