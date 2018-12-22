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
  static async update(db1,db2){
    DataBase.structure = [];
    if(DataBase.enabled === true && DataBase.databases.length>1){
      let times = [];
      for(let d in DataBase.databases){
        let db = DataBase.databases[d];
        let timeInfo = await db.query("SELECT TABLE_NAME,UPDATE_TIME FROM information_schema.tables WHERE TABLE_SCHEMA = '"+db.options.database+"'");
        times.push(timeInfo);
      }
      for(let t in times[0]){
        DataBase.structure.push(times[0][t]["TABLE_NAME"]);
      }
      let lengthTimes = times.length;
      let mayor = DataBase.databases[0];
      let mayorData = times[0];
      for(let tMain=1; tMain<lengthTimes;tMain++){
        if(times[tMain].length === mayorData.length){
          let aux=0,
              tempLength = times[tMain].length;
          while(aux<tempLength){
            if(times[tMain][aux]["UPDATE_TIME"]>mayorData[aux]["UPDATE_TIME"]){
              mayor = DataBase.databases[tMain];
              mayorData = times[tMain];
              break;
            } else if(mayorData[aux]["UPDATE_TIME"]>times[tMain][aux]["UPDATE_TIME"]){
              break;
            }
            aux++;
          }
        }
      }

      let databasesToUpdate=[];

      for(let tMain=0; tMain<lengthTimes;tMain++){
        if(times[tMain].length === mayorData.length){
          let aux=0,
              tempLength = times[tMain].length;
          while(aux<tempLength){
            if(times[tMain][aux]["UPDATE_TIME"]>mayorData[aux]["UPDATE_TIME"]){
              console.error("nani");
              break;
            } else if(mayorData[aux]["UPDATE_TIME"]>times[tMain][aux]["UPDATE_TIME"]){
              databasesToUpdate.push(DataBase.databases[tMain]);
              break;
            }
            aux++;
          }
        }
      }
      await mayor.copyToDatabases(databasesToUpdate);
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
      for(let d in DataBase.databases){
        if(DataBase.databases[d].id === this.id){
          DataBase.databases.splice(d, 1);
        }
      }
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
      if(this.connection===null || this.enabled===false){
        resolve(null);
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
    console.log(this.options.host+": "+sql,0.5);
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

  async getPromisesTables(promisesTables,promises,promisesSelect){
    let dataList=[],
        conditionList=[];

    for(let ur in promisesTables){
      for(let userResult in promisesTables[ur]){
        let actualData = promisesTables[ur][userResult];
        table = DataBase.structure[ur];
        underscore = table.split("_");
        condition="";
        for(let u=0;u<underscore.length;u++){
          if(u!=0){
            condition+=" AND ";
          }
          idName="id_"+underscore[u];
          id = actualData[idName];
          condition += idName+"="+id;
        }
        promisesSelect.push({
          "table":table,
          "request":db.query("SELECT * FROM "+table+" WHERE "+condition),
          "data":actualData,
          "condition":condition
        });
      }
    }
    var a = promisesSelect.map(function(x) {
       return x["request"];
    });
    await Promise.all(a).then((a) => {
      for(let ur in promisesSelect){
        let tempResult = promisesSelect[ur]["request"];
        tempResult.then( (result) => {
          promises.push(db.updateStuff(result,promisesSelect[ur]));
        });
      }
    });
  }

  async copyToDatabases(dbs){
    if(this.connection !== null){
      let table,
          underscore,
          condition,
          id,
          idName,
          tempResult,
          promisesTables=[],
          promises=[];
      for(let s=0;s<DataBase.structure.length;s++){
        table = DataBase.structure[s];
        let userResults=this.query("SELECT * FROM "+table);
        promisesTables.push(userResults);
      }
      for(let d in dbs){
        let db = dbs[d];
        if(db.id !== this.id && db.connection !== null){
          await Promise.all(promisesTables).then((promisesTables) => {
            this.getPromisesTables(promisesTables,promises,promisesSelect)
          });
        }
      }
      await Promise.all(promises);
    }
  }

  updateStuff(result,data){
    let call;
    if(result.length>0){
      call=this.query("UPDATE "+data["table"]+" SET ? WHERE "+data["condition"],data["data"]);
    } else {
      call=this.query("INSERT INTO "+data["table"]+" SET ?",data["data"]);
    }
    return call;
  }
}

DataBase.databases=[];

exports.dbQuery = async function(sql,object){
  let result = null;
  if(DataBase.enabled === true && DataBase.databases.length > 0){
    for(let d in DataBase.databases){
      let db = DataBase.databases[d];
      if(db !== null && db.enabled === true && db.connection !== null){
        if(result === null){
          result = await db.query(sql,object);
        } else {
          db.query(sql,object);
        }
      }
    }
  }
  return result;
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
      for(let dc in databaseConfig){
        if(databaseConfig[dc].enabled === true){
          console.performance();
          let tempDb = new DataBase(databaseConfig[dc].options);
          console.performance();
          await tempDb.start();
          console.performance();
        }
      }
      console.log("Finished loading databases");
      console.log("Starting database merge");
      DataBase.update();
      console.log("Database merge ended");
    } else {
      console.error("Couldn't find database config file");
    }
  }
}
