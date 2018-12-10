'use strict';

/**
Levels of logs:
0-Always print no matter what, don't use this level
1-Important routines
2-Important steps trought the code
3-Whatever else

**/

const fs = require('fs'), util = require('util');

let LogObject = null;

class Logger {
  static get(){
    return LogObject;
  }

  static init(level){
    let l = (level) ? level : 3
    LogObject = new Logger(l);
  }

  constructor(level) {
    this.level = level;
    this.outputFile = "./output/output-"+Date.now()+".txt";
    var self = this;
    console.log = function() {
      let l = 3;
      if(!isNaN(arguments[arguments.length-1])){
        l = parseInt(arguments[arguments.length-1]);
      }
      let r = util.format.apply(null, arguments);
      self.log(r,l);
      process.stdout.write(self.parseOutput(r,l));
    };
    console.error = console.log;
  }

  getLevel(){
    return this.level;
  }

  parseOutput(message,lvl){
    let result = "",
        date = new Date(),
        Dd = (date.getDate()+'').padStart(2,"0"),
        Mm = ((date.getMonth()+1)+'').padStart(2,"0"),
        Yyyy = date.getFullYear(),
        hh = (date.getHours()+'').padStart(2,"0"),
        mm = (date.getMinutes()+'').padStart(2,"0"),
        ss = (date.getSeconds()+'').padStart(2,"0");

    result += "("+lvl+") ["+Dd+"-"+Mm+"-"+Yyyy+" "+hh+":"+mm+":"+ss+"] "+message+"\n";

    return result;
  }

  output(message,lvl){
    fs.appendFileSync(this.outputFile, this.parseOutput(message,lvl));
  }

  log(message,lvl){
    if(lvl <= this.level){
      let date = new Date(),
      hh = date.getHours(),
      mm = date.getMinutes(),
      ss = date.getSeconds();
    }
    this.output(message,lvl);
  }
}

module.exports = {
  Logger:Logger,
  log:(message,lvl) => {
    if(LogObject){
      LogObject.log(message,lvl);
    } else {
      console.error("LogObject not created");
    }
  }
}
