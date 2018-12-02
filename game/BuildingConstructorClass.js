'use strict';

const Building = require(__dirname+"/BuildingClass.js");

module.exports = class BuildingConstructor {
  constructor(){
    this.buildings={
      "1":{
        name:"Homless",
        cost:10,
        costMultiplier:1.5,
        cps:5,
        cpsMultiplier:1.5
      },
      "2":{
        name:"Shelter",
        cost:50,
        costMultiplier:1.5,
        cps:10,
        cpsMultiplier:1.5
      },
      "3":{
        name:"Appartment",
        cost:250,
        costMultiplier:1.5,
        cps:100,
        cpsMultiplier:1.5
      },
      "4":{
        name:"House",
        cost:3000,
        costMultiplier:1.5,
        cps:1000,
        cpsMultiplier:1.5
      },
      "5":{
        name:"Palace",
        cost:50000,
        costMultiplier:1.5,
        cps:2000,
        cpsMultiplier:1.5
      }
    };
  }
  checkExists(id){
    var buildingInfo = this.buildings[id];
    if(buildingInfo){
      return true;
    }
    return false;
  }
  createBuilding(id){
    var buildingInfo = this.buildings[id];
    if(buildingInfo){
      return new Building(
        id,
        buildingInfo.name,
        buildingInfo.cost,
        buildingInfo.costMultiplier,
        buildingInfo.cps,
        buildingInfo.cpsMultiplier
      );
    }
    return null;
  }
}
