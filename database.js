var mysql = require('mysql');

var con = null;/*mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword"
});*/

function start(){

  /*con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });*/
  return con;
}

module.exports = {
  start:start
}
