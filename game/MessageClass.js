'use strict';
module.exports = class User {
  constructor(client) {
    this.color=3447003;
    this.title="";
    this.url="";
    this.description="";
    this.fields=[];
    this.footer={
      icon_url:client.user.avatarURL,
      text:client.user.username
    }
  }

  setTitle(title){
    this.title=title;
  }

  setColor(color){
    this.color=color;
  }

  setDescription(description){
    this.description=description;
  }

  addField(name,value){
    if(value && name){
      var o ={};
      o["name"]=name;
      o["value"]=value;
      this.fields.push(o);
    }
  }

  print(){
    if(this.title.length){
      var o = {};
      o.embed = {};
      o.embed.color=this.color;
      o.embed.title=this.title;
      if(this.url){
        o.embed.url=this.url;
      }
      if(this.description){
        o.embed.description=this.description;
      }
      o.embed.fields=this.fields;
      o.embed.timestamp=new Date();
      o.embed.footer=this.footer;
      return o;
    } else {
      return null;
    }
  }
}
