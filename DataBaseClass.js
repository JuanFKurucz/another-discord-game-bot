'use strict';

/**
  This currently does nothing
**/
const mysql = require('mysql');

class DataBase {

  constructor(){
    this.printErrors=true;
    this.options = {
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
    };
    this.start();
  }
  start(){
    this.connection=mysql.createConnection(this.options);
    this.connection.connect((err) => {
      if (err) {
        if(this.printErrors){
          console.error(err);
        }
        this.connection=null;
      } else{
        console.log("Connected!");
      }
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
    if(this.connection===null){
      return await (new Promise((resolve, reject) => {
        resolve(null);
      }));
    }
    let response;
    try {
      response = await this.queryPromise(sql,object);
    } catch(e){
      if(this.printErrors){
        console.error(e);
      }
      response = null;
    }
    return response;
  }
}

const database = new DataBase();

exports.dbQuery = async function(sql,object){
  return await database.query(sql,object);
};
