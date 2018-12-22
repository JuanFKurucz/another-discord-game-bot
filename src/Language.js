'use strict';

const fs = require('fs');

String.prototype.format = function () {
  const num = arguments.length;
  let text = this.replace("","");
  for (let i = 0; i < num; i++) {
    const pattern = "\\{" + (i) + "\\}",
          re = new RegExp(pattern, "g");
    text = text.replace(re, arguments[i]);
  }
  return text;
};

class Language {
  static getLan(serverId){
    let lan="en";
    switch(serverId){
      case "526101590550118410":
        lan = "fr";
        break;
      case "526085327539142676":
        lan = "es";
        break;
    }
    return lan;
  }

  static getCommands(){
    return Language.lancommands;
  }

  static lancommands(){}
  static languages(){}
  static get(id,lan="en",options={}){
    if(Language.languages.hasOwnProperty(lan) && Language.languages[lan].hasOwnProperty(id.toLowerCase())){
      let text = Language.languages[lan][id.toLowerCase()];
      if(options.hasOwnProperty("style")){
        switch(options.style){
          case "camelcase":
            var words = text.split(" ");
            for(let w in words){
              words[w]=Language.upperCaseFirstChar(words[w],true);
            }
            text = words.join(" ");
            break;
          case "lower":
            text = text.toLowerCase();
            break;
        }
      } else {
        text = Language.upperCaseFirstChar(text);
      }
      return text;
    } else {
      if(options.hasOwnProperty("default")){
        return options.default;
      } else {
        console.error("There is no translation for this text: "+id.toLowerCase());
        if(Language.languages["en"][id.toLowerCase()]){
          return Language.languages["en"][id.toLowerCase()];
        } else {
          return "";
        }
      }
    }
  }

  static upperCaseFirstChar(text,strict=false){
    const firstChar = text.charAt(0).toUpperCase();
    let rest = text.slice(1);
    rest = (strict===true) ? rest.toLowerCase() : rest;
    return  firstChar+rest;
  }

  static init(){
    Language.languages = {};
    Language.lancommands={};
    const commandsFolder = "./src/locale/",
          files = fs.readdirSync(commandsFolder);
    files.forEach(function(filename) {
      let lan = filename.split(".")[0];
      Language.languages[lan]=JSON.parse(fs.readFileSync(commandsFolder+filename, 'utf8'));
      for(let l in Language.languages[lan]){
        if(l.indexOf("command_")!==-1){
          let underscoreSplit = l.split("_");
          if(underscoreSplit.length===2){
            if(!Language.lancommands.hasOwnProperty(lan)){
              Language.lancommands[lan]={};
            }
            Language.lancommands[lan][Language.languages[lan][l]]=l;
          }
        }
      }
    });
  }
}
Language.init();
module.exports = Language;
