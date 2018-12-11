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

  static init(level,maxTrace){
    let l = (level) ? level : 3;
    let mT = (maxTrace) ? maxTrace : 1;
    LogObject = new Logger(l,mT);
  }

  getFileAndLine() {
    let response = "\nTrace";
    let end = "\n";
    if(this.maxTrace===0){
      return "";
    } else if(this.maxTrace===1){
      response = "";
      end = "";
    }
    let obj = {};
    Error.captureStackTrace(obj, this.getFileAndLine);

    let stackTrace = obj.stack.split("\n");
    let tope = 3+this.maxTrace;
    if(stackTrace.length<tope){
      tope = stackTrace.length;
    }
    for(let i=3;i<tope;i++){
      response+=" -> "+stackTrace[i].substring(stackTrace[i].indexOf("(")+1,stackTrace[i].indexOf(")")).replace(/^.*[\\\/]/, '');
    }
    return response+end;
  };

  constructor(level,maxTrace) {
    this.level = level;
    this.maxTrace = maxTrace;
    this.outputFile = "./output/output-"+Date.now()+".txt";
    let self = this;
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

    result += "("+lvl+") ["+Dd+"-"+Mm+"-"+Yyyy+" "+hh+":"+mm+":"+ss+"] "+message+" "+this.getFileAndLine()+"\n";

    return result;
  }

  output(message){
    fs.appendFileSync(this.outputFile, message);
  }
}
