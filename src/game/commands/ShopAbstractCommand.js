"use strict";

const Command = require("../Command.js"),
      ShopList = require("../ShopList.js"),
      BuildingConstructor = require("../constructors/BuildingConstructor.js");

module.exports = class ShopAbstractCommand extends Command {
  constructor(id,name,prefix) {
    super(id,name);
    this.prefix=prefix;
    this.constructor = null;
    this.shopList = null;
  }

  async buy(message,name){
    let response = await this.shopList.buyItem(name);

    if(response === null){
      response = this.prefix+"_noexists";
    }

    message.setTitle(this.prefix+"_buy");
    message.setDescription(response);
  }

  displayList(message,page=0){
    const printList = this.shopList.printList(page),
        printListLength = printList.length;

    for(let s = 0; s<printListLength; s++){
      message.addField(printList[s].title,printList[s].description);
    }

    message.setTitle(this.prefix+"_list");
  }

  async execute(message,user,command){
    console.time();
    this.shopList = new ShopList(user,this.constructor);
    if(command.length>1){
      command.shift();
      command = command.join(" ");
      if(isNaN(command)){
        await this.buy(message,command);
      } else {
        this.displayList(message,parseInt(command,10));
      }
    } else {
      this.displayList(message);
    }
    console.time();
  }
}
