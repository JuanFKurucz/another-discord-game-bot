'use strict';
const Command = require("../CommandClass.js");
const BuildingConstructor = require("../constructors/BuildingConstructorClass.js");

module.exports = class BuyCommand extends Command {
  constructor(id,name,description) {
    super(id,name,description);
    this.constructor = new BuildingConstructor();
  }

  async buyBuilding(m,command,user){
    const id_building = parseInt(command[1]),
          userBuilding = user.getItem(this.constructor.getObjectName(),id_building),
          building = (userBuilding === null) ? this.constructor.create(id_building) : userBuilding;
    let response="";

    if(building !== null){
      if(await building.acquire(user)){
        if(building.getLevel()>1){
          response = "You upgraded your building !";
        } else {
          response = "You bought a building "+id_building+"!";
        }
      } else {
        response = user.mention+" don't have enough cookies...";
      }
    } else {
      response = "This building doesn't exist";
    }

    m.setTitle("Buy building");
    m.setDescription(response);
  }

  displayBuildingList(m,user){
    let building=null,
        buildingInfo="",
        tmp="";

    m.setTitle("List of buildings");

    for(let w in this.constructor.elements){
      tmp="";
      building=user.getItem(this.constructor.getObjectName(),w);
      if(!building){
        building=this.constructor.create(w);
      }
      buildingInfo=building.nextLevelInfo();

      if(!building.canPurchase(user)){
        tmp = " (Not affordable yet)";
      }

      m.addField(
        w+". "+buildingInfo.name + " Level: "+buildingInfo.level + tmp,
        " Price: "+ buildingInfo.cost + "   " +" Cps: "+ buildingInfo.cps
      );
    }
  }

  async execute(m,user,command){
    console.performance();
    if(command.length>1){
      await this.buyBuilding(m,command,user)
    } else {
      await this.displayBuildingList(m,user);
    }
    console.performance();
  }
}
