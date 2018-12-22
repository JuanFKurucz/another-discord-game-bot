'use strict';
String.prototype.format = function () {
  var i = 0, args = arguments;
  return this.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};

const fs = require('fs');

class Language {
  static languages(){}
  static get(id,lan="en"){
    return Language.languages[lan][id];
  }

  static init(){
    Language.languages = {};
    const commandsFolder = "./src/locale/",
          files = fs.readdirSync(commandsFolder);
    files.forEach(function(filename) {
      Language.languages[filename.split(".")[0]]=JSON.parse(fs.readFileSync(commandsFolder+filename, 'utf8'));
    });

  }
}
Language.init();
module.exports = Language;
