"use strict";

const Main = require(__dirname+"/src/Main.js"),
      tokenInfo = require(__dirname+"/token.json");

var Program = new Main();
Program.start(tokenInfo["token"]);
