'use strict';
const Command = require("../CommandClass.js");

module.exports = class InfoCommand extends Command {
  constructor(id,name,description) {
    super(id,name,description);
  }

  makeList(objects){
    let aux=null,
        response="";

    for(var i in objects){
      aux=objects[i];
      response+=aux.print()+"\n";
    }

    return response;
  }

  addList(m,title,objects){
    let list = this.makeList(objects);
    if(list!==""){
      m.addField(title,list);
    }
  }

  execute(m,user,command){
    let response="You have "+user.cookies+" cookies" + "\n" +
                  "CPS: "+user.getTotalCps() + "\n"+
                  "CPM: "+user.getTotalCpm();

    m.setTitle("Player information");
    m.setDescription(response);
    this.addList(m,"Buildings owned",user.buildings);
    this.addList(m,"Upgrades owned",user.upgrades);
  }
}
