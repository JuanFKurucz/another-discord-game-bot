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

var buildings={
  "1":new b.building("1","Shelter",10,5),
  "2":new b.building("2","Shelter",50,10),
  "3":new b.building("3","Appartment",250,100),
  "4":new b.building("4","House",3000,1000),
  "5":new b.building("5","Palace",50000,2000),
};


const prefix = "!";

function commandHandler(msg){
@ -18,15 +27,20 @@ function commandHandler(msg){
  if(text.indexOf(prefix)===0){
    text=text.substring(prefix.length,text.length);
    var command = text.split(" ");
    var user=users[msg.author.id];
    switch(command[0]){
      case "info":
        response="You have "+users[msg.author.id].cookies+" cookies";
        break;

      case "buy":
        var building=new b.Building(parseFloat(command[1]));
        users[msg.author.id].buildings.push(building);
        var building=buildings[parseInt(command[1])];
        if(building.acquire(user)){
          response="You bought a building "+command[1]+"!";
        }
        else{
          reponse="You don't have enough cookies...";
        }
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
