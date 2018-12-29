"use strict";

const {config} = require("./Configuration.js");

module.exports = class Banner {
  constructor(messageObject) {
    this.message=messageObject;
    this.text=messageObject.embeds[0].title;
    this.doThisAgain(this.message,this.text,0,config("banner","max"));
  }

  async getEmoji(id){
    if(id===""){
      return "";
    }
    try{
      const emojiList = require("./Bot.js").get().client.guilds.get(config("serverId")).emojis,
            emoji = await emojiList.find((emoji) => emoji.id === id);
      if(emoji){
        return emoji.toString();
      }
    } catch(e){
      console.error(e);
    }
    return "";
  }

  async writeChars(msgAbstract,index,max,callback){
    let realmessage="",
        partMessage=(msgAbstract+" "+msgAbstract).slice(index,index+max);
    const dictionary = config("banner","dictionary"),
          list1=dictionary[partMessage[0]].split(" "),
          emojis = config("banner","emojis");

    for(let y=0;y<list1.length;y++){
      for(let m=0;m<max;m++){
        if(m<partMessage.length){
          let list = dictionary[partMessage[m]].split(" ");
          for(let w=0;w<list[y].length;w++){
            try{
              realmessage+=await this.getEmoji(emojis[list[y][w]]);
            }catch(e){
              console.error(e);
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
      console.error(e);
    }
    actualIndex++;
    if(actualIndex>=messageText.length){
      actualIndex=0;
    }
    setTimeout(() => {
      this.doThisAgain(msg,messageText,actualIndex,max)
    },500);
  }
}
