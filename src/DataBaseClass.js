'use strict';

/**
  This currently does nothing
**/
const mysql = require('mysql');
const structure = ["building","upgrade","user","user_building","user_upgrade"];

class DataBase {

  constructor(config,enabled=true){
    this.enabled = enabled;
    this.printErrors=true;
    this.options = config;
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
        //  console.error(e);
        }
        response=null;
      }
    }
    return response;
  }

  async copyDatabase(db){
    if(this.connection){
      let table,
          underscore,
          condition,
          id,
          idName,
          tempResult;
      for(let s=0;s<structure.length;s++){
        table = structure[s];
        for(let userResult of (await db.query("SELECT * FROM "+table))){
          underscore = table.split("_");
          condition="";
          for(let u=0;u<underscore.length;u++){
            if(u!=0){
              condition+=" AND ";
            }
            idName="id_"+underscore[u];
            id = userResult[idName];
            condition += idName+"="+id;
          }

          tempResult=await this.query("SELECT * FROM "+table+" WHERE "+condition);
          if(!tempResult.next().done){
            this.query("UPDATE "+table+" SET ? WHERE "+condition,userResult);
          } else {
            this.query("INSERT INTO "+table+" SET ?",userResult);
          }
        }
      }
    }
  }
}


const database = new DataBase({
  connectionLimit: 100,
  host: "db4free.net",
  user: "notagame_jfk",
  password: "alpaca123456",
  database: "notagame",
  debug: false
});

const localDatabase = new DataBase({
  connectionLimit: 100,
  host: "localhost",
  user: "root",
  password: "",
  database: "notagame",
  debug: false
});


localDatabase.copyDatabase(database);

exports.dbQuery = async function(sql,object){
  let result=null,
      temp;
  if(database.connection){
    result = await database.query(sql,object);
  }
  if(localDatabase.connection){
    temp = await localDatabase.query(sql,object);
  }
  if(result===null){
    result=temp;
  }
  return result;
};

exports.dbChangeEnable = function(bool){
  database.setEnabled(bool);
}
