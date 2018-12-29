"use strict";

const fs = require('fs');

let Config = null;

module.exports = class Configuration {
  static get(parent,param){
    if(Config===null){
      Config = new Configuration();
    }
    return Config.config[parent][param];
  }

  constructor() {
    this.config={};
    this.init();
  }

  init(){
    const configsFolder = "./src/config/",
          files = fs.readdirSync(configsFolder);
    files.forEach((filename) => {
      let name = filename.split(".")[0];
      this.config[name]=JSON.parse(fs.readFileSync(configsFolder+filename, 'utf8'));
    });
  }
}
