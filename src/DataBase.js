'use strict';

/**
  This currently does nothing
**/
const mysql = require('mysql'),
      fs = require('fs');

class DataBase {
  static enabled(){}
  static databases(){}
  static structure(){}

  static async getStructure(db1,db2){
    DataBase.structure = [];
    if(DataBase.enabled === true && DataBase.databases.length>1){
      let db = DataBase.databases[0],
          table = await db.query("SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_SCHEMA = '"+db.options.database+"'");
      for(let t in table){
        DataBase.structure.push(table[t]["TABLE_NAME"]);
      }
    }
  }

  constructor(config,enabled=true){
    this.connection=null;
    this.enabled = enabled;
    this.printErrors=true;
    this.options = config;
    this.id=DataBase.databases.length;
    DataBase.databases.push(this);
  }

  setEnabled(bool){
    this.enabled=bool;
    if(bool === false){
      DataBase.databases = DataBase.databases.filter(db => db.id !== this.id);
    }
  }

  onError(err){
    console.error(err,4);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      this.setEnabled(false);                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      console.error(err);                               // server variable configures this)
    }
  }

  connect(resolve,reject,err){
    if (err) {
      if(this.printErrors){
        console.log(err,4);
      }
      this.connection=null;
      this.setEnabled(false);
      resolve(false);
    } else{
      console.log(this.options.host+" connected!",0.5);
      resolve(true);
    }
  }

  async startConnection(resolve,reject){
    console.log("connecting...");
    this.connection.connect((err) => {
      this.connect(resolve,reject,err);
    });
    this.connection.on('error', (err) => {
      this.onError(err)
    });
  }

  async start(){
    if(this.enabled){
      console.log("Loading "+this.options.host+" database");
      this.connection=mysql.createConnection(this.options);
      return await new Promise((resolve,reject) => {
        this.startConnection(resolve,reject);
      });
    }
  }

  queryPromise(sql,args) {
    return new Promise((resolve,reject ) => {
      this.connection.query(sql,args,(err,rows) => {
        (err) ? reject(err) : resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve,reject) => {
      this.connection.end(err => {
        (err) ? reject(err) : resolve();
      });
    });
  }

  async query(sql,object){
    console.log(this.options.host+"("+this.options.database+")"+": "+sql,0.5);
    let response;
    try {
      response = await this.queryPromise(sql,object);
    } catch(e){
      if(this.printErrors){
        console.log(sql,4);
        console.log(object,4);
        console.log(e,4);
      }
      response = null;
    }
    return response;
  }

  static async loadDataBases(databaseConfig){
    for(let dc in databaseConfig){
      if(databaseConfig[dc].enabled === true){
        console.performance();
        let tempDb = new DataBase(databaseConfig[dc].options);
        console.performance();
        await tempDb.start();
        console.performance();
      }
    }
  }

  canExecute(){
    return this.enabled === true && this.connection !== null;
  }

  static async executeQuerys(sql,object){
    let result = null,
        length = DataBase.databases.length;
    for(let d = 0; d<length; d++){
      let db = DataBase.databases[d];
      if(db !== null && db.canExecute() === true){
        (result === null) ? result = await db.query(sql,object) : db.query(sql,object);
      }
    }
    return result
  }
}

DataBase.databases=[];

exports.dbQuery = async function(sql,object){
  return (DataBase.enabled === true && DataBase.databases.length > 0) ? DataBase.executeQuerys(sql,object) : null;
};

exports.dbChangeEnable = async function (bool="true"){
  console.performance();
  let boolValue = bool == "true";
  console.log("Database enabled: "+boolValue);
  DataBase.enabled = boolValue;
  if(boolValue === true){
    let configFile = './databases.json';
    if (fs.existsSync(configFile) === true) {
      console.log("Reading databases config file");
      let databaseConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
      console.log("Finished reading databases, starting loading them");
      DataBase.loadDataBases(databaseConfig);
      console.log("Finished loading databases");
      DataBase.getStructure();
    } else {
      console.error("Couldn't find database config file");
    }
  }
}
