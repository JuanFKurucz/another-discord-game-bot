"use strict";

const Command = require("../Command.js"),
      ShopList = require("../ShopList.js"),
      BuildingConstructor = require("../constructors/BuildingConstructor.js");

module.exports = class BuyCommand extends Command {
  constructor(id,name) {
    super(id,name);
    this.constructor = new BuildingConstructor();
    this.shopList = null;
  }

  async buyBuilding(message,name){
    let response = await this.shopList.buyItem(name);

    if(response === null){
      response = "buy_noexists";
    }

    message.setTitle("buy_building");
    message.setDescription(response);
  }

  displayBuildingList(message,page=0){
    const printList = this.shopList.printList(page),
        printListLength = printList.length;

    for(let s = 0; s<printListLength; s++){
      message.addField(printList[s].title,printList[s].description);
    }

    message.setTitle("buy_list");
  }

  async execute(message,user,command){
    console.time();
    this.shopList = new ShopList(user,this.constructor);
    if(command.length>1){
      command.shift();
      command = command.join(" ");
      if(isNaN(command)){
        await this.buyBuilding(message,command);
      } else {
        this.displayBuildingList(message,parseInt(command));
      }
    } else {
      this.displayBuildingList(message);
    }
    console.time();
  }
}
