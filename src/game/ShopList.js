"use strict";

const Language = require("../Language.js");

module.exports = class ShopList {
  constructor(user,itemConstructor) {
    this.owner=user;
    this.itemConstructor=itemConstructor;

    this.list = this.makeList(this.owner,itemConstructor);
    this.itemsPerPage = 3;
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
