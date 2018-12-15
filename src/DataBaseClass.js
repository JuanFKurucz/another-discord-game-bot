'use strict';

/**
  This currently does nothing
**/
const mysql = require('mysql');

class DataBase {
  static structure(){}

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

  async query(sql,object,iterator=true){
    console.log(this.options.host+": "+sql);
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
        if(iterator){
          response = response[Symbol.iterator]();
        }
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
      for(let s=0;s<DataBase.structure.length;s++){
        table = DataBase.structure[s];
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
            await this.query("UPDATE "+table+" SET ? WHERE "+condition,userResult);
          } else {
            await this.query("INSERT INTO "+table+" SET ?",userResult);
          }
        }
      }
      return new Promise((resolve,reject) => {
        resolve();
      })
    } else {
      return new Promise((resolve,reject) => {
        reject();
      })
    }
  }

  static async update(db1,db2){
    DataBase.structure = [];
    if(db1.connection!=null && db2.connection!=null){
      let dbname1=db1.options.database,
          dbname2=db2.options.database,
          times1=await db1.query("SELECT TABLE_NAME,UPDATE_TIME FROM information_schema.tables WHERE TABLE_SCHEMA = '"+dbname1+"'",{},false),
          times2=await db2.query("SELECT TABLE_NAME,UPDATE_TIME FROM information_schema.tables WHERE TABLE_SCHEMA = '"+dbname2+"'",{},false);

      let aux1=0;
      let aux2=0;
      let mayor=null;
      let menor=null;

      while(aux1<times1.length || aux2<times2.length){
        DataBase.structure.push(times1[aux1]["TABLE_NAME"]);
        if(mayor===null && menor===null){
          if(times1[aux1]["UPDATE_TIME"]>times2[aux2]["UPDATE_TIME"]){
            mayor=db1;
            menor=db2;
          } else if(times2[aux2]["UPDATE_TIME"]>times1[aux1]["UPDATE_TIME"]){
            mayor=db2;
            menor=db1;
          }
        }
        aux1++;
        aux2++;
      }

      return await menor.copyDatabase(mayor);
    } else {
      return new Promise((resolve,reject) => {
        reject();
      })
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

if(database.connection !== null && localDatabase.connection !== null){
  //DataBase.update(database,localDatabase);
}

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
