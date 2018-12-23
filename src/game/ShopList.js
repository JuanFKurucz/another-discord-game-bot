"use strict";

const Language = require("../Language.js");

module.exports = class ShopList {
  constructor(user,itemConstructor) {
    this.owner=user;
    this.itemConstructor=itemConstructor;

    this.list = this.makeList(this.owner,itemConstructor);
    this.itemsPerPage = 3;
    this.owner.shopList = this;
    this.message = null;
    this.reactions = {
      "numbers":[
        "526463862409789469",
        "526463864737628170",
        "526463864699617290",
        "526463864838291506",
        "526463864968052737"
      ],
      "previousPage":"526463866205634581",
      "nextPage":"526463866658357290",
      "increment":"526463866364887060",
      "decrement":"526463866381664256"
    };
    this.reactions2={
      "1":"526463862409789469",
      "2":"526463864737628170",
      "3":"526463864699617290",
      "4":"526463864838291506",
      "5":"526463864968052737",
      "previousPage":"526463866205634581",
      "nextPage":"526463866658357290",
      "increment":"526463866364887060",
      "decrement":"526463866381664256"
    };
    this.lastList=null;
  }

  async putReactions(){
    this.message.clearReactions();

    const lengthLastList = this.lastList.length;

    await this.message.react(this.reactions["previousPage"]);
    for(let i=0;i<lengthLastList;i++){
      await this.message.react(this.reactions["numbers"][i]);
    }
    await this.message.react(this.reactions["increment"]);
    await this.message.react(this.reactions["decrement"]);
    await this.message.react(this.reactions["nextPage"]);
  }

  getReactions(list){
    const returnList = [];

    for(let key in list){
      if(typeof list[key] === "string"){
        returnList.push(list[key]);
      }
    }
    for(let key in list["numbers"]){
      returnList.push(list["numbers"][key]);
    }

    return returnList;
  }

  async updateMessage(){

    await this.setMessage(this.message);
  }

  handleReactions(){
    const filter = (reaction, user) => {
      return this.getReactions(this.reactions).includes(reaction.emoji.id) && user.id === this.owner.getId();
    };
    this.message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
    .then(async (collected) => {
        const reaction = collected.first(),
              id_reaction = reaction._emoji.id;
        console.log(id_reaction);
        let action = Object.keys(this.reactions2).find(key => this.reactions2[key] === id_reaction);
        console.log(action);
        switch(action){
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
            var index = parseInt(action)-1;
            if(index>0 && index<this.lastList.length){
              this.lastList[index].acquire(this.owner);
            }
            break;
          case "previousPage":
            break;
          case "nextPage":
            break;
          case "increment":
            break;
          case "decrement":
            break;
        }
        await this.updateMessage();
    })
    .catch(collected => {
        console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
    });
  }

  async setMessage(message){
    this.message=message;
    await this.putReactions();
    this.handleReactions();
  }

  makeList(user,itemConstructor){
    const resultList = {};

    for(let i in itemConstructor.elements){
      let item = user.getItem(itemConstructor.getObjectName(),i);
      if(item === null){
        item=itemConstructor.create(i);
      }
      if(item.canAcquire(user)){
        resultList[Language.get(item.getName(),user.getLanguage()).toLowerCase()]=item;
      }
    }

    return resultList;
  }

  getList(page = 0){
    const endIndex = page + this.itemsPerPage,
          responseList = [],
          keys = Object.keys(this.list),
          keysLength = keys.length;

    for(let i = page*this.itemsPerPage; i<endIndex; i++){
      if(i>=keysLength){
        break;
      }
      responseList.push(this.list[keys[i]]);
    }

    return responseList;
  }

  printList(page = 0){
    const pageList = this.getList(page),
          pageListLength = pageList.length,
          response = [];

    for(let i = 0 ; i < pageListLength; i++){
      let object = pageList[i].printBuy(this.owner);
      object.title = (i+1)+". "+object.title;
      response.push(object);
    }
    this.lastList = pageList;
    return response;
  }

  async buyItem(name){
    const realName = name.toLowerCase();
    if(this.list.hasOwnProperty(realName) === false){
      return null;
    } else {
      return await this.list[realName].acquire(this.owner);
    }
  }

}
