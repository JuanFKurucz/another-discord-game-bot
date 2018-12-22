'use strict';
const Language = require("../../Language.js"),
      Command = require("../Command.js");

module.exports = class InfoCommand extends Command {
  constructor(id,name) {
    super(id,name);
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
    const response=Language.get("info_message",user.getLanguage()).format(user.getCookies(),user.getTotalCps(),user.getTotalCpm());

    m.setTitle(Language.get("info_title",user.getLanguage()));
    m.setDescription(response);
    for(let i in user.items){
      this.addList(m,i.charAt(0).toUpperCase() + i.slice(1)+" owned",user.items[i]);
    }
    console.performance();
  }
}
