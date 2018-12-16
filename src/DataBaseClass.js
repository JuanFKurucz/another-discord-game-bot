'use strict';

/**
  This currently does nothing
**/
const mysql = require('mysql');
let database=null,
    localDatabase=null;

class DataBase {
  static structure(){}
  static async update(db1,db2){
    DataBase.structure = [];
    if(db1.connection!=null && db2.connection!=null){
      let dbname1=db1.options.database,
          dbname2=db2.options.database,
          times1=await db1.query("SELECT TABLE_NAME,UPDATE_TIME FROM information_schema.tables WHERE TABLE_SCHEMA = '"+dbname1+"'"),
          times2=await db2.query("SELECT TABLE_NAME,UPDATE_TIME FROM information_schema.tables WHERE TABLE_SCHEMA = '"+dbname2+"'");

      let aux1=0;
      let aux2=0;
      let mayor=null;
      let menor=null;

      while(aux1<times1.length && aux2<times2.length){
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
      await menor.copyDatabase(mayor)
    } else {
      await new Promise((resolve,reject) => {
        resolve(null);
      })
    }
  }

  constructor(config,enabled=true){
    this.connection=null;
    this.enabled = enabled;
    this.printErrors=true;
    this.options = config;
  }

  setEnabled(bool){
    this.enabled=bool;
  }

  async start(){
    if(this.enabled){
      console.log("Loading "+this.options.host+" database");
      this.connection=mysql.createConnection(this.options);
      return await new Promise(async (resolve,reject) => {
        console.log("connecting...");
        this.connection.connect((err) => {
          if (err) {
            if(this.printErrors){
              console.error(err);
            }
            this.connection=null;
            resolve(false);
          } else{
            console.log(this.options.host+" connected!",0.5);
            resolve(true);
          }
        });
      });
    } else {
      return await new Promise((resolve,reject) => {
        resolve(false);
      })
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
        console.error(sql);
        console.error(object);
        console.error(e);
      }
      response = null;
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
          tempResult,
          promisesTables=[],
          promisesSelect=[],
          promises=[];
      for(let s=0;s<DataBase.structure.length;s++){
        table = DataBase.structure[s];
        let userResults=db.query("SELECT * FROM "+table);
        promisesTables.push(userResults);
      }
      await Promise.all(promisesTables).then(async (promisesTables) => {
        var dataList=[];
        var conditionList=[];
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
              "request":this.query("SELECT * FROM "+table+" WHERE "+condition),
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
              promises.push(this.updateStuff(result,promisesSelect[ur]));
            });
          }
        });
      });
      await Promise.all(promises);
    } else {
      await new Promise((resolve,reject) => {
        resolve(null);
      })
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

exports.dbQuery = async function(sql,object){
  if(database.enabled===false){
    return new Promise((resolve,reject) => {
      resolve(null);
    })
  } else {
    let result=null,
        temp;
    if(database&&database.connection){
      result = await database.query(sql,object);
    }
    if(localDatabase&&localDatabase.connection){
      temp = await localDatabase.query(sql,object);
    }
    if(result===null){
      result=temp;
    }
    return result;
  }
};

exports.dbChangeEnable = async function (bool="true"){
  let boolValue = bool == "true";
  console.log("Database enabled: "+boolValue);
  if(boolValue){
    localDatabase = new DataBase({
      connectionLimit: 100,
      host: "localhost",
      user: "root",
      password: "",
      database: "notagame",
      debug: false
    });

    database = new DataBase({
      connectionLimit: 100,
      host: "db4free.net",
      user: "notagame_jfk",
      password: "alpaca123456",
      database: "notagame",
      acquireTimeout: 10000,
      debug: false
    });


    await localDatabase.start();
    await database.start();
    console.log("Finished loading databases");
    if(database.connection !== null && localDatabase.connection !== null){
      console.log("Updating databases");
      await DataBase.update(database,localDatabase);
      console.log("Finished updating databases");
    }
  } else {
    await new Promise((resolve,reject) => {
      resolve();
    });
  }
}
