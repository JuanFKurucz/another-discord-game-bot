var b = require(__dirname+"/BuildingClass.js");

var buildings={
  "1":{
    name:"Homless",
    cost:10,
    cps:5
  },
  "2":{
    name:"Shelter",
    cost:50,
    cps:10
  },
  "3":{
    name:"Appartment",
    cost:250,
    cps:100
  },
  "4":{
    name:"House",
    cost:3000,
    cps:1000
  },
  "5":{
    name:"Palace",
    cost:50000,
    cps:2000
  }
};


function createBuilding(id){
  var buildingInfo = buildings[id];
  if(buildingInfo){
    return b.Building(
      id,
      buildingInfo.name,
      buildingInfo.cost,
      buildingInfo.cps
    );
  }
  return null;
}
module.exports = {
  createBuilding:createBuilding
}
