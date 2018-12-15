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
    let tope = 5+this.maxTrace;
    if(stackTrace.length<tope){
      tope = stackTrace.length;
    }
    for(let i=5;i<tope;i++){
      response+=" -> "+stackTrace[i].substring(stackTrace[i].indexOf("(")+1,stackTrace[i].indexOf(")")).replace(/^.*[\\\/]/, '');
    }
    return response+end;
  };

  constructor(level,maxTrace) {
    this.style={
      "type":{
        "reset":"\x1b[0m",
        "bright":"\x1b[1m",
        "dim":"\x1b[2m",
        "underscore":"\x1b[4m",
        "blink":"\x1b[5m",
        "reverse":"\x1b[7m",
        "hidden":"\x1b[8m"
      },
      "font":{
        "black":"\x1b[30m",
        "red":"\x1b[31m",
        "green":"\x1b[32m",
        "yellow":"\x1b[33m",
        "blue":"\x1b[34m",
        "magenta":"\x1b[35m",
        "cyan":"\x1b[36m",
        "white":"\x1b[37m"
      },
      "background":{
        "back":"\x1b[40m",
        "red":"\x1b[41m",
        "green":"\x1b[42m",
        "yellow":"\x1b[43m",
        "blue":"\x1b[44m",
        "magenta":"\x1b[45m",
        "cyan":"\x1b[46m",
        "white":"\x1b[47m"
      }
    };

    this.level = level;
    this.maxTrace = maxTrace;
    this.outputFile = "./output/output-"+Date.now()+".txt";
    let self = this;
    console.log = function() {
      self.console(arguments);
    };
    console.error = function(){
      self.console(arguments,"red");
    };
  }

  console(args,color="white"){
    let l = 3;
    if(!isNaN(args[args.length-1])){
      l = parseInt(args[args.length-1]);
    }
    let r = util.format.apply(null, args);
    let cute = this.parseOutput(r,l);
    this.output(cute);
    process.stdout.write(this.style.font[color]+cute);
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
