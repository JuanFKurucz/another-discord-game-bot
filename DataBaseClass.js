'use strict';

/**
  This currently does nothing
**/
const mysql = require('mysql');

class DataBase {

  constructor(){
    this.connection=mysql.createConnection({
      connectionLimit: 100,
      /*host: "localhost",
      user: "root",
      password: "",
      database: "notagame",*/
      host: "db4free.net",
      user: "notagame_jfk",
      password: "alpaca123456",
      database: "notagame",
      debug: false
    });
    this.start();
  }
  start(){
    this.connection.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
    });
  }
  queryPromise(sql,args) {
    return new Promise((resolve,reject ) => {
      this.connection.query(sql,args,(err,rows) => {
        if (err)
          return reject(err);
        resolve(rows);
      });
    });
  }
  close() {
    return new Promise((resolve,reject) => {
      this.connection.end(err => {
        if (err)
          return reject(err);
        resolve();
      });
    });
  }

  async query(sql,object){
    let response;
    try {
      response = await this.queryPromise(sql,object);
    } catch(e){
      console.error(e);
      response = null;
    }
    return response;
  }
}

const database = new DataBase();

exports.dbQuery = async function(sql,object){
  return await database.query(sql,object);
};
