'use strict';
const Command = require("../Command.js");

module.exports = class InfoCommand extends Command {
  constructor(id,name) {
    const description = "Use to retrieve user profile and information";
    super(id,name,description);
  }

  makeList(objects){
    let aux=null,
        response="";

    for(let i in objects){
      aux = objects[i];
      response += aux.print()+"\n";
    }

    return response;
  }

  addList(m,title,objects){
    const list = this.makeList(objects);
    if(list !== ""){
      m.addField(title,list);
    }
  }

  async execute(m,user,command){
    console.performance();
    const response="You have "+user.getCookies()+" cookies" + "\n" +
                  "CPS: "+user.getTotalCps() + "\n"+
                  "CPM: "+user.getTotalCpm();

    m.setTitle("Player information");
    m.setDescription(response);
    for(let i in user.items){
      this.addList(m,i.charAt(0).toUpperCase() + i.slice(1)+" owned",user.items[i]);
    }
    console.performance();
  }
}
