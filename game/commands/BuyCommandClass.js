'use strict';
const Command = require(__dirname+"/CommandClass.js");
const BuildingConstructor = require("../BuildingConstructorClass.js");

module.exports = class BuyCommand extends Command {
  constructor(id,name) {
    super(id,name);
    this.constructor = new BuildingConstructor();
  }

  buyBuilding(m,command,user){
    m.setTitle("Buy building");
    let response="";
    let id_building = parseInt(command[1]);
    var userBuilding = user.getBuilding(id_building);
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
    m.setDescription(response);
  }

  displayBuildingList(m,user){
    var nbuilding=null,
        response="";
    m.setTitle("List of buildings");
    for(var w in this.constructor.elements){
      nbuilding=user.getBuilding(w);
      if(!nbuilding){
        nbuilding= this.constructor.create(w);
      }
      nbuilding=nbuilding.nextLevelInfo();
      response += w+". "+ nbuilding.name + " ("+nbuilding.level+")" +
      " Price: "+ nbuilding.cost +
      " Cps: "+ nbuilding.cps;
      if(user.cookies<nbuilding.cost){
        response += " (Not affordable yet)\n";
      } else {
        response += "\n";
      }
    }
    m.setDescription(response);
  }

  execute(m,user,command){
    if(command.length>1){
      this.buyBuilding(m,command,user)
    } else {
      this.displayBuildingList(m,user);
    }
  }
}
