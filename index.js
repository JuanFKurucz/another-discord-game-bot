"use strict";

const Main = new require(__dirname+"/src/Main.js");

var Program = new Main();
Program.start(require(__dirname+"/token.json").token);
