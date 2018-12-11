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

module.exports = class Logger {
  static get(){
    return LogObject;
  }

  static init(level){
    let l = (level) ? level : 3
    LogObject = new Logger(l);
  }

  getFileAndLine() {
    var obj = {};
    Error.captureStackTrace(obj, this.getFileAndLine);
    let stackTrace = obj.stack.split("\n");
    let response = "Trace";
    for(let i=3;i<stackTrace.length;i++){
      response+=" -> "+stackTrace[i].substring(stackTrace[i].indexOf("(")+1,stackTrace[i].indexOf(")")).replace(/^.*[\\\/]/, '');
    }
    return response;
  };

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
      let cute = self.parseOutput(r,l);
      self.output(cute);
      process.stdout.write(cute);
    };
    //console.error = console.log;
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

    result += "("+lvl+") ["+Dd+"-"+Mm+"-"+Yyyy+" "+hh+":"+mm+":"+ss+"] "+message+" \n"+this.getFileAndLine()+"\n\n";

    return result;
  }

  output(message){
    fs.appendFileSync(this.outputFile, message);
  }
}
