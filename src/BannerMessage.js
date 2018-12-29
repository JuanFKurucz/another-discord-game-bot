"use strict";

const Bot = require("./Bot.js");

class Banner {
  constructor(messageObject) {
    this.message=messageObject;
    this.text=messageObject.embeds[0].title;
    console.info(this.text);
    this.doThisAgain(this.message,this.text,0,Banner.max);
  }

  async getEmoji(id){
    if(id==""){
      return "";
    }
    try{
      const emojiList = Bot.get().client.guilds.get(Banner.serverId).emojis,
            emoji = await emojiList.find(emoji => emoji.id == id);
      if(emoji){
        return emoji.toString();
      }
    } catch(e){

    }
    return "";
  }

  async writeChars(msgAbstract,index,max,callback){
    let realmessage="",
        partMessage=(msgAbstract+" "+msgAbstract).slice(index,index+max);
    const list1=Banner.dictionary[partMessage[0]].split(" ");

    for(let y=0;y<list1.length;y++){
      for(let m=0;m<max;m++){
        if(m<partMessage.length){
          let list = Banner.dictionary[partMessage[m]].split(" ");
          for(let w=0;w<list[y].length;w++){
            try{
              realmessage+=await this.getEmoji(Banner.emojis[list[y][w]]);
            }catch(e){

            }
          }
          realmessage+=" ";
        }
      }
      realmessage+="\n";
    }
    return realmessage;
  }

  async doThisAgain(msg,messageText,actualIndex,max){
    try{
      await msg.edit(await this.writeChars(messageText,actualIndex,max)+"\n"+actualIndex);
    }catch(e){

    }
    actualIndex++;
    if(actualIndex>=messageText.length){
      actualIndex=0;
    }
    setTimeout(()=>{this.doThisAgain(msg,messageText,actualIndex,max)},500);
  }
}

Banner.serverId="509053465016795147";
Banner.max = 5;
Banner.dictionary = { //3x5
  "a":"bbb bnb bnb bbb bnb",
  "b":"bbn bnb bbn bnb bbn",
  "c":"bbb bnn bnn bnn bbb",
  "d":"bbn bnb bnb bnb bbn",
  "e":"bbb bnn bbb bnn bbb",
  "f":"bbb bnn bbb bnn bnn",
  "g":"bbb bnn bnb bnb bbb",
  "h":"bnb bnb bbb bnb bnb",
  "i":"nbn nbn nbn nbn nbn",
  "j":"nnb nnb nnb nnb bbb",
  "k":"bnb bnb bbn bnb bnb",
  "l":"bnn bnn bnn bnn bbb",
  "m":"bnb bbb bnb bnb bnb",
  "n":"nnb bnb bbb bnb bnn",
  "o":"bbb bnb bnb bnb bbb",
  "p":"bbb bnb bbb bnn bnn",
  "q":"bbb bnb bnb bbb nnb",
  "r":"bbn bnb bbn bnb bnb",
  "s":"bbb bnn bbb nnb bbb",
  "t":"bbb nbn nbn nbn nbn",
  "u":"bnb bnb bnb bnb bbb",
  "v":"bnb bnb bnb bnb nbn",
  "w":"bnb bnb bnb bbb bnb",
  "x":"bnb bnb nbn bnb bnb",
  "y":"bnb bnb nbn nbn nbn",
  "z":"bbb nnb nbn bnn bbb",
  " ":", , , , ,"
};
Banner.emojis = {
  "b":526982553807224842,
  "n":526982553811288084,
  ",":526981193003171850
};

module.exports = Banner;
