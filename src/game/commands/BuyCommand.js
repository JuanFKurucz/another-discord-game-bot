"use strict";

const ShopAbstractCommand = require("./ShopAbstractCommand.js"),
      BuildingConstructor = require("../constructors/BuildingConstructor.js");

module.exports = class BuyCommand extends ShopAbstractCommand {
  constructor(id,name) {
    super(id,name,"buy");
    this.constructor = new BuildingConstructor();
  }
}
