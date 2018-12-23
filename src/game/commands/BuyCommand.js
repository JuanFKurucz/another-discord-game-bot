"use strict";

const Command = require("../Command.js"),
      BuildingConstructor = require("../constructors/BuildingConstructor.js");

module.exports = class BuyCommand extends Command {
  constructor(id,name) {
    super(id,name);
    this.constructor = new BuildingConstructor();
  }

  async buyBuilding(m,command,user){
    const id_building = parseInt(command[1]),
          userBuilding = user.getItem(this.constructor.getObjectName(),id_building),
          building = (userBuilding === null) ? this.constructor.create(id_building) : userBuilding;

    let response="";

    if(building !== null){
      response = await building.acquire(user);
    } else {
      response = "buy_noexists";
    }

    m.setTitle("buy_building");
    m.setDescription(response);
  }

  displayBuildingList(m,user){
    let building=null,
        buildingInfo="",
        tmp="";

    m.setTitle("buy_list");

    for(let w in this.constructor.elements){

      building=user.getItem(this.constructor.getObjectName(),w);
      if(building === null){
        building=this.constructor.create(w);
      }
      buildingInfo=building.nextLevelInfo();

      if(building.canPurchase(user) === false){
        tmp = " (^_notaffordable^)";
      } else {
        tmp="";
      }

      m.addField(
        w+". ^"+building.getName()+"^ ^_level^: "+buildingInfo.level + tmp,
        " ^_price^: "+ buildingInfo.cost + "   " +" ^_cps^: "+ buildingInfo.cps
      );
    }
  }

  async execute(m,user,command){
    console.time();
    if(command.length>1){
      await this.buyBuilding(m,command,user)
    } else {
      await this.displayBuildingList(m,user);
    }
    console.time();
  }
}
