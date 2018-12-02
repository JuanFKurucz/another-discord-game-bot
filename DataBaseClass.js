'use strict';

/**
  This currently does nothing
**/

const mysql = require('mysql');

module.exports = class Bot {
  constructor(){
    this.con=null;
    /*mysql.createConnection({
      host: "localhost",
      user: "yourusername",
      password: "yourpassword"
    });*/
    this.start();
  }
  start(){

    /*con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
    });*/
    return this.con;
  }
}
