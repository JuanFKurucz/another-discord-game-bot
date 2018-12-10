'use strict';

/**
  This index.js is meant to work as any main file of any project.

  Here are the main variables that we need to start the bot, token and botId, in the future there will be databases credentials.

  Here we just call for Bot and DataBase classes and start them.
**/

const Bot = new require(__dirname+"/BotClass.js");
const { dbChangeEnable } = require(__dirname+"/DataBaseClass.js");
const token = 'NTE4NDc3Nzc3NTcwMTAzMjk2.DuRVpw.FrIJP52YjMI_ZRr2Jr_VI0ZzhmI';

var argumentDatabase = process.argv[2];
if(argumentDatabase){
  var bool = argumentDatabase.split("=")[1];
  if(bool == 'false'){
    console.log("DataBase disabled");
    dbChangeEnable(false);
  } else {
    console.log("DataBase enabled");
    dbChangeEnable(true);
  }
} else {
  console.log("DataBase configuration is as default");
}


console.log("Starting bot please wait...");
let botObject = Bot.get();
console.log("Bot created");



process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    botObject.saveDatabase();
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


botObject.start(token);
console.log("Bot initiated");
