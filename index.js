const bot = require(__dirname+"/bot.js");
const database = require(__dirname+"/database.js");

let db = database.start();
let b = bot.start(db);
