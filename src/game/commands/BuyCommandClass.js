'use strict';
const Command = require("../CommandClass.js");
const BuildingConstructor = require("../constructors/BuildingConstructorClass.js");

module.exports = class BuyCommand extends Command {
  constructor(id,name,description) {
    super(id,name,description);
    this.constructor = new BuildingConstructor();
  }

  buyBuilding(m,command,user){
    let response="",
        id_building = parseInt(command[1]),
        userBuilding = user.getBuilding(id_building);

    if(userBuilding== null) {
      var building = this.constructor.create(id_building);
      if(building!=null){
        if(building.acquire(user)){
          response="You bought a building "+id_building+"!";
        } else {
          response=user.mention+" don't have enough cookies...";
        }
      } else {
        response = "This building doesn't exist";
      }
    } else if(userBuilding.levelUp(user)){
      response="You upgraded your building !";
    } else {
      response=user.mention+" don't have enough cookies...";
    }

    m.setTitle("Buy building");
    m.setDescription(response);
  }

  displayBuildingList(m,user){
    let building=null,
        buildingInfo="",
        tmp="";

    m.setTitle("List of buildings");

    for(var w in this.constructor.elements){
      tmp="";
      building=user.getBuilding(w);
      if(!building){
        building=this.constructor.create(w);
      }
      buildingInfo=building.nextLevelInfo();

      if(!building.canPurchase(user)){
        tmp = " (Not affordable yet)";
      } else {
        tmp = "";
      }
      m.addField(
        w+". "+buildingInfo.name + " Level: "+buildingInfo.level + tmp,
        " Price: "+ buildingInfo.cost + "   " +" Cps: "+ buildingInfo.cps
      );
    }
  }

  execute(m,user,command){
    if(command.length>1){
      this.buyBuilding(m,command,user)
    } else {
      this.displayBuildingList(m,user);
    }
  }
}
