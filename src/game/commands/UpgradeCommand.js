"use strict";

const ShopAbstractCommand = require("./ShopAbstractCommand.js"),
      UpgradeConstructor = require("../constructors/UpgradeConstructor.js");

module.exports = class UpgradeCommand extends ShopAbstractCommand {
  constructor(id,name) {
    super(id,name,"upgrade");
    this.constructor = new UpgradeConstructor();
  }
}
