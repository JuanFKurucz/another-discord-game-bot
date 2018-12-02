'use strict';

/**
  This index.js is meant to work as any main file of any project.

  Here are the main variables that we need to start the bot, token and botId, in the future there will be databases credentials.

  Here we just call for Bot and DataBase classes and start them.
**/

const Bot = new require(__dirname+"/BotClass.js");
const DataBase = require(__dirname+"/DataBaseClass.js");
const token = 'NTE4NDc3Nzc3NTcwMTAzMjk2.DuRVpw.FrIJP52YjMI_ZRr2Jr_VI0ZzhmI';
const botId = "518477777570103296";

let db = new DataBase();

let botObject = new Bot(botId);
botObject.start(token);
