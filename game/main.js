/*
  Cookies are earned by:
  -Messages (a message is a click)
  -Seconds
*/
var u = require(__dirname+"/UserClass.js");
var b = require(__dirname+"/BuildingConstructorClass.js");

var users={
  //"id":UserObject
};
/*
users
  buildings
    [
      Home <-- level up,
      Homless
      Shetler
    ]
*/
const prefix = "!";

function commandHandler(msg){
  let response = "";
  let text = msg.content+"";
  if(text.indexOf(prefix)===0){
    text=text.substring(prefix.length,text.length);
    var command = text.split(" ");
    var user=users[msg.author.id];
    switch(command[0]){
      case "info":
        response="You have "+user.cookies+" cookies\nBuildings owned:\n";
        for(var i=0;i<user.buildings.length;i++){
          response+=user.buildings[i].name+" (Level: "+user.buildings[i].level+")\n";
        }
        break;

      case "buy":
        if(building){
          if(getBuilding(parseInt(command[1]))== null) {
            var building=b.createBuilding(parseInt(command[1]));
            if(building.acquire(user)){
              response="You bought a building "+command[1]+"!";
            } else {
              response=user.mention+" don't have enough cookies...";
            }
          } else if(building.levelUp(user)){
              response="You upgraded your building !";
            } else {
                response=user.mention+" don't have enough cookies...";
              }   
          } else {
              response="This building doesn't exist";
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
