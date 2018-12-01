/*
  Cookies are earned by:
  -Messages (a message is a click)
  -Seconds
*/

var users={
  //"id":cookieNumber
};

function read(msg){ //dm or text
  let result = "";

  if(!users.hasOwnProperty(msg.author.id)){
    users[msg.author.id]=0;
  }

  users[msg.author.id]++;

  result = "You have "+users[msg.author.id]+" cookies";

  return result;
}

module.exports = {
  read:read
}
