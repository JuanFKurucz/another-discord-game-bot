"use strict";

const Command = require("../Command.js");

module.exports = class BannerCommand extends Command {
  constructor(id,name) {
    super(id,name);
  }

  async execute(m,user,command){
    console.time();
    command.shift();
    command = command.join(" ");
    user.messageBanner=true;
    m.setTitle(command);
    console.time();
  }
};
