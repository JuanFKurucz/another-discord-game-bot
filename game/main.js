/*
  Cookies are earned by:
  -Messages (a message is a click)
  -Seconds
*/
var u = require(__dirname+"/UserClass.js");
var b = require(__dirname+"/BuildingClass.js");

var users={
  //"id":UserObject
};

const prefix = "!";

function commandHandler(msg){
  let response = "";
  let text = msg.content+"";
  if(text.indexOf(prefix)===0){
    text=text.substring(prefix.length,text.length);
    var command = text.split(" ");
    switch(command[0]){
      case "info":
        response="You have "+users[msg.author.id].cookies+" cookies";
        break;

      case "buy":
        response="You bought a building "+command[1]+"!";
        var building=new b.Building(parseFloat(command[1]));
        users[msg.author.id].buildings.push(building);
        break;

      default:
        response = "Unknown command";
        break;
    }
  }
  return response;
}

function read(msg){ //dm or text
  let result = "";
  if(!users.hasOwnProperty(msg.author.id)){
    users[msg.author.id]=new u.User(msg.author.id);
  }
  users[msg.author.id].cookies++;
  return commandHandler(msg);
}

var daemon = setInterval(function(){
  for(var u in users){
    users[u].claimCookies();
  }
},1000); //1 sec in milliseconds

module.exports = {
  read:read
}
