"use strict";

const Language = require("../../Language.js"),
      Command = require("../Command.js"),
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
      if(await building.acquire(user)){
        if(building.getLevel()>1){
          response = Language.get("buy_levelUp",user.getLanguage());
        } else {
          response = Language.get("buy_acquire",user.getLanguage()).format(id_building);
        }
      } else {
        response = Language.get("_nocookies",user.getLanguage()).format(user.mention);
      }
    } else {
      response = Language.get("buy_noexists",user.getLanguage());
    }

    m.setTitle(Language.get("buy_building",user.getLanguage()));
    m.setDescription(response);
  }

  displayBuildingList(m,user){
    let building=null,
        buildingInfo="",
        tmp="";

    m.setTitle(Language.get("buy_list",user.getLanguage()));

    for(let w in this.constructor.elements){

      building=user.getItem(this.constructor.getObjectName(),w);
      if(building === null){
        building=this.constructor.create(w);
      }
      buildingInfo=building.nextLevelInfo();

      if(building.canPurchase(user) === false){
        tmp = " ("+Language.get("_notaffordable",user.getLanguage())+")";
      } else {
        tmp="";
      }

      m.addField(
        w+". "+building.getName(user.getLanguage()) + " "+Language.get("_level",user.getLanguage())+": "+buildingInfo.level + tmp,
        " "+Language.get("_price",user.getLanguage())+": "+ buildingInfo.cost + "   " +" "+Language.get("_cps",user.getLanguage())+": "+ buildingInfo.cps
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
