'use strict';

module.exports = class Constructor {
  constructor(elements){
    this.elements=elements;
  }

  getElement(id){
    return this.elements[id];
  }

  checkExists(id){
    var elementInfo = this.getElement(id);
    if(elementInfo){
      return true;
    }
    return false;
  }

  createObject(id,info){
    //override
  }

  create(id){
    var elementInfo = this.getElement(id);
    if(elementInfo){
      return this.createObject(id,elementInfo);
    }
    return null;
  }
}
