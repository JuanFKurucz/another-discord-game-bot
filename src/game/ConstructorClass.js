'use strict';

module.exports = class Constructor {
  constructor(oName,elements){
    this.elements=elements;
    this.objectName=oName;
  }

  getObjectName(){
    return this.objectName;
  }

  getElement(id){
    const element = this.elements[id];
    return (typeof element !== "undefined") ? element : null;
  }

  checkExists(id){
    return typeof this.getElement(id) !== null;
  }

  createObject(id,info){
    //override
  }

  create(id){
    const element = this.getElement(id);
    return (typeof element !== "undefined") ? this.createObject(id,element) : null;
  }
}
