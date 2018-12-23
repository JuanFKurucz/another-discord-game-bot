"use strict";

const Command = require("../Command.js"),
      ShopList = require("../ShopList.js"),
      UpgradeConstructor = require("../constructors/UpgradeConstructor.js");

module.exports = class UpgradeCommand extends Command {
  constructor(id,name) {
    super(id,name);
    this.constructor = new UpgradeConstructor();
    this.shopList = null;
  }

  async buyUpgrade(message,name){
    let response = await this.shopList.buyItem(name);

    if(response === null){
      response = "upgrade_noexists";
    }

    message.setTitle("upgrade_buy");
    message.setDescription(response);
  }

  displayUpgradeList(message,page=0){
    const printList = this.shopList.printList(page),
        printListLength = printList.length;

    for(let s = 0; s<printListLength; s++){
      message.addField(printList[s].title,printList[s].description);
    }

    message.setTitle("upgrade_list");
  }

  async execute(message,user,command){
    console.time();
    this.shopList = new ShopList(user,this.constructor);
    if(command.length>1){
      command.shift();
      command = command.join(" ");
      if(isNaN(command)){
        await this.buyUpgrade(message,command);
      } else {
        this.displayUpgradeList(message,parseInt(command));
      }
    } else {
      await this.displayUpgradeList(message);
    }
    console.time();
  }
}
