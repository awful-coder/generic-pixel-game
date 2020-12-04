const FRAMERATE = 30;

function $(x){return document.querySelector(x);}

var ctx = $("#c").getContext("2d");

function hitbox(x,y,w,h){
    
}

function sprite(framessrc,update,hitbox){
    if(update===undefined){
        update=function(){};
    }
    this.frames=framessrc;
    this.display=false;
    this.onupdate=update;
    this.hitbox=0;
    this.update=function(){
        //internal
        this.onupdate();
    }
}

function update(){
    
}

window.setInterval(update,1000/FRAMERATE);