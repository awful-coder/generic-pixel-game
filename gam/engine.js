const width=1200;
const height=800;
const resolution=100/16;
sprites=[];
class hitbox{
    constructor(x,y,w,h){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.u=(w*(w>h))+(h*(h>=w));
        this.collide=hit2=>{
            var collision=false;
            if (
                (
                    (this.x>=hit2.x && this.x<=hit2.x+hit2.w)||
                    (this.x+this.w>=hit2.x && this.x+this.w<=hit2.x+hit2.w)
                ) && 
                (
                    (this.y>=hit2.y && this.y<=hit2.y+hit2.h)||
                    (this.y+this.h>=hit2.y && this.y+this.h<=hit2.y+hit2.h)
                )
            ){collision=true;}
            if (
                (
                    (hit2.x>=this.x && hit2.x<=this.x+this.w)||
                    (hit2.x+hit2.w>=this.x && hit2.x+hit2.w<=this.x+this.w)
                ) && 
                (
                    (hit2.y>=this.y && hit2.y<=this.y+this.h)||
                    (hit2.y+hit2.h>=this.y && hit2.y+hit2.h<=this.y+this.h)
                )
            ){collision=true;}

            return collision;
        };
        this.cx=()=>{
            return this.x+this.w/2;
        };
        this.cy=()=>{
            return this.y+this.h/2;
        };
        this.surface=hit2=>{
            var newcoord=[this.x,this.y,true,true];
            var difference=[(this.cx()-hit2.cx())/(hit2.w/this.w),(this.cy()-hit2.cy())*(hit2.h/this.h)];
            //onsole.log(newcoord,difference);
            //console.log(difference);
            if(Math.abs(difference[0])>Math.abs(difference[1])){
                if(difference[0]<0){
                    newcoord[0]=hit2.x-this.w;
                    newcoord[2]=false;
                } else {
                    newcoord[0]=hit2.x+hit2.w;
                    newcoord[2]=false;
                }
            } else {
                if(difference[1]<0){
                    newcoord[1]=hit2.y-this.h;
                    newcoord[3]=false;
                } else {
                    newcoord[1]=hit2.y+hit2.h;
                    newcoord[3]=false;
                }
            }
            
            //console.log(newcoord);
            
            this.x=newcoord[0];
            this.y=newcoord[1];
             
            return newcoord;
        };
    }
}
SCORE=0;


var c = document.getElementById("c");
var ctx = c.getContext("2d");

/*function filledrect(x,y,width,height,color){
    ctx.fillStyle=color;
    ctx.rect(x,y,width,height);
    ctx.fill();
}*/

class sprite{
    constructor(x,y,w,h,imgsrcs,hascollision,xv,yv){
        if(xv===undefined){xv=0}
        if(yv===undefined){yv=0}
        if(hascollision===undefined){hascollision=true;}
        
        this.hascollision=hascollision;
        this.x=x;
        this.y=y;
        this.xv=xv;
        this.yv=yv;
        this.w=w;
        this.h=h;
        //this.color=color;
        this.imgsrcs=imgsrcs;
        this.img=new Image(w,h);
        this.img.src=this.imgsrcs[0];
        
        this.hitbox=new hitbox(this.x,this.y,this.w,this.h);
        
        /*if(onupdate===undefined){onupdate=()=>{}}
        this.onupdate=onupdate;*/
        this.onupdate=()=>{};
        
        this.update=()=>{
            
            this.x=this.x+this.xv;
            this.y=this.y+this.yv;
            this.hitbox.x=this.x;
            this.hitbox.y=this.y;

            this.xv=this.xv*0.9/*5*/;
            this.yv=this.yv*0.9/*5*/;

            this.onupdate();
            ctx.drawImage(this.img,Math.floor((this.x-scrn.x)/resolution)*resolution,Math.floor((this.y-scrn.y)/resolution)*resolution,this.w,this.h);
            //this.x=Math.floor(this.x);
            //this.y=Math.floor(this.y);
        }
        sprites.push(this);
    }
}


key={"up":false,"down":false,"left":false,"right":false,"space":false}
document.addEventListener("keydown",function(e){
    if (event.keyCode===38) {
        key.up=true;
    }
    if (event.keyCode===40) {
        key.down=true;
    }
    if (event.keyCode===37) {
        key.left=true;
    }
    if (event.keyCode===39) {
        key.right=true;
    }
    if (event.keyCode===32) {
        //new Audio(game_audio.swing).play();
        key.space=true;
    }
})
document.addEventListener("keyup",function(event){
    if (event.keyCode===38) {
        key.up=false;
    }
    if (event.keyCode===40) {
        key.down=false;
    }
    if (event.keyCode===37) {
        key.left=false;
    }
    if (event.keyCode===39) {
        key.right=false;
    }
    if (event.keyCode===32) {
        key.space=false;
    }
})

scrn={"x":0,"y":0,"scroll-locks-x":[],"scroll-locks-y":[/*{pos:-500,block:"up"}*/]};


function update(){
    //console.log(player.x,player.y);
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle="#8fefff";
    ctx.fillRect(0,0,width,height);
    ctx.beginPath();
    scrn.x=player.x-((width/2)-(player.w/2));
    scrn.y=player.y-((height/2)-(player.h/2));
    
    
    scrn["scroll-locks-x"].forEach((x)=>{
        if(x.block=="left" && scrn.x>x.pos){scrn.x=x.pos}
        else if(x.block=="right" && scrn.x<x.pos){scrn.x=x.pos}
    });
    scrn["scroll-locks-y"].forEach((y)=>{
        if(y.block=="up" && scrn.y<y.pos){scrn.y=y.pos}
        else if(y.block=="down" && scrn.y>y.pos){scrn.y=y.pos}
    });
    
    for(var i=0;i<sprites.length;i++){
        x=sprites[i];
        var prev_len=sprites.length;
        x.update();
        i-=prev_len-sprites.length;
    }
    
    ctx.fillStyle="#ffffff";
    ctx.font="50px VT323";
    ctx.textAlign="left";
    ctx.fillText(Math.floor(SCORE).toLocaleString('pl-pl',{minimumIntegerDigits:6,useGrouping:'true'}),20,50);
    
    /*sprites.forEach(function(x){
    });*/
}

setInterval(update,25);