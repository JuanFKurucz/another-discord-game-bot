'use strict';

/**
  This currently does nothing
**/
const mysql = require('mysql');

class DataBase {

  constructor(enabled=true){
    this.enabled = enabled;
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
  setEnabled(bool){
    this.enabled=bool;
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
      if(this.connection===null || this.enabled===false){
        reject(null);
      } else {
        this.connection.query(sql,args,(err,rows) => {
          if (err)
            return reject(err);
          resolve(rows);
        });
      }
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
    console.log(sql);
    let response;
    try {
      response = await this.queryPromise(sql,object);
    } catch(e){
      if(this.printErrors){
        console.error(e);
      }
      response = null;
    }
    if(response !== null){
      try{
        response = response[Symbol.iterator]();
      } catch(e){
        if(this.printErrors){
          console.error(e);
        }
        response=null;
      }
    }
    return response;
  }
}

const database = new DataBase();

exports.dbQuery = async function(sql,object){
  return await database.query(sql,object);
};

exports.dbChangeEnable = function(bool){
  database.setEnabled(bool);
}
