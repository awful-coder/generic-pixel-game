const TILE_SIZE=100;

function entityCollide(debug=false){
    sprites.forEach(
            function(x){
                if(x!=this && !(x instanceof playerSprite) && x.hascollision &&(x.x>this.x-500 && x.x<this.x+this.w+500 && x.y>this.y-500 &&                     x.y<this.y+this.h+500)){
                    if(x.hitbox.collide(this.hitbox)){
                        if(x instanceof spring){
                            if(x.y>this.y&&Math.abs(this.hitbox.cx()-x.hitbox.cx())<TILE_SIZE*.8){
                                this.yv=-75;
                                x.activate();
                            }
                        }else{
                            var c=this.hitbox.surface(x.hitbox);

                            this.x=c[0];
                            this.y=c[1];
                            this.xv=this.xv*c[2];
                            this.yv=this.yv*c[3];
                        }
                    }
                }
            },
            this
        );
}
function gravity(){
    this.yv+=1.25;
}

class crate_base extends sprite{
    constructor(x,y,onBreak){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/crate.png"]);
        this.onBreak=onBreak.bind(this);
        this.onupdate=function(){
            //this.hascollision=player.y<this.y;
            if(this.hitbox.collide(player.hitbox)&&key.space){
                this.onBreak();
                sprites.splice(sprites.indexOf(this),1);
            }
            gravity.call(this);
            entityCollide.call(this);
        };
    }
}
class coin_crate extends crate_base{
    constructor(x,y){
        super(x,y,function(){
            new coin(this.x,this.y);
        })
    }
}
class coin extends sprite{
    constructor(x,y){
        super(x+25,y+25,50,50,["assets/coin.png"],false);
        this.onupdate=function(){
            if(this.hitbox.collide(player.hitbox)){
                SCORE++;
                sprites.splice(sprites.indexOf(this),1);
                new Audio(game_audio.coin).play();
            }
        };
    }
}
class spikes extends sprite{
    constructor(x,y){
        super(x,y+50,100,50,["assets/spikes.png"],false);
        this.onupdate=function(){
            if(this.hitbox.collide(player.hitbox)){
                death();
                //new Audio(game_audio.coin).play();
            }
        };
    }
}

// dammit i wish we had enum types
// omg that would be so cool
class grass_0 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_00.png"]);
    }
}
class grass_1 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_01.png"]);
    }
}
class grass_2 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_02.png"]);
    }
}
class grass_3 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_03.png"]);
    }
}
class grass_4 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_04.png"]);
    }
}
class grass_5 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_05.png"]);
    }
}
class grass_6 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_06.png"]);
    }
}
class grass_7 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_07.png"]);
    }
}
class grass_8 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_08.png"]);
    }
}
class grass_9 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_09.png"]);
    }
}
class grass_10 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_10.png"]);
    }
}
class grass_11 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_11.png"]);
    }
}
class grass_12 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_12.png"]);
    }
}
class grass_13 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_13.png"]);
    }
}
class grass_14 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_14.png"],false);
    }
}
class grass_15 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_15.png"],false);
    }
}
class grass_16 extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/grass_tile/tile_16.png"]);
    }
}

class portal extends sprite{
    constructor(x,y,w,h,imgsrc,leadsTo){
        super(x,y,TILE_SIZE,TILE_SIZE*2,imgsrc,false);
        this.leadsTo=leadsTo;
        this.use=()=>{
            setTimeout(load_map.bind(null,MAPS[this.leadsTo],0,0),5);
        };
    }
}

class door extends portal{
    constructor(x,y,leadsTo){
        super(x,y,TILE_SIZE,TILE_SIZE*2,["assets/door.png"],leadsTo);
        this.onupdate=()=>{
            //console.log(this.leadsTo);
            if(this.hitbox.collide(player.hitbox)&&player.y>=this.y+TILE_SIZE&&player.hitbox.cx()>this.x+TILE_SIZE*0.1&&player.x<this.x+TILE_SIZE*0.8&&key.space){
                this.use();
            }
        };
    }
}

class gem_base extends portal{
    constructor(x,y,imgsrc,leadsto){
        super(x,y,TILE_SIZE,TILE_SIZE*2,imgsrc);
        this.onupdate=()=>{
            if(this.hitbox.collide(player.hitbox)){
                sprites.splice(sprites.indexOf(this),1);
                this.use();
                game_audio.gem.play();
            }
        }
    }
}

class red_gem extends gem_base{
    constructor(x,y){
        super(x,y,["assets/gems/gem_0.png"]);
    }
}
class yellow_gem extends gem_base{
    constructor(x,y){
        super(x,y,["assets/gems/gem_1.png"]);
    }
}
class green_gem extends gem_base{
    constructor(x,y){
        super(x,y,["assets/gems/gem_2.png"]);
    }
}
class blue_gem extends gem_base{
    constructor(x,y){
        super(x,y,["assets/gems/gem_3.png"]);
    }
}
class rainbow_gem extends gem_base{
    constructor(x,y){
        super(x,y,["assets/gems/gem_4.png"]);
    }
}

function getPortal(portal_class,leadsTo){
    return (
        class extends portal_class{
            constructor(x,y){
                super(x,y,leadsTo);
            }
        }
        
        );
}

const playerFrameMap={
    walk:[0,1,2,3,4,5,6,7],
    jump:8,
    fall:9,
    damage:10,
    stand:11
};

class playerSprite extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,[
            "assets/player/right_stand.png",
            [
                "assets/player/left_0.png","assets/player/left_1.png","assets/player/left_2.png","assets/player/left_3.png","assets/player/left_4.png","assets/player/left_3.png","assets/player/left_2.png","assets/player/left_1.png",
                "assets/player/left_jump.png","assets/player/left_fall.png","assets/player/left_damage.png","assets/player/left_stand.png"
            ],
            [
                "assets/player/right_0.png","assets/player/right_1.png","assets/player/right_2.png","assets/player/right_3.png","assets/player/right_4.png","assets/player/right_3.png","assets/player/right_2.png","assets/player/right_1.png",
                "assets/player/right_jump.png","assets/player/right_fall.png","assets/player/right_damage.png","assets/player/right_stand.png"
            ]
        ]);
        this.walkFrame=0;
        this.facingRight=true;
        this.img.src=this.imgsrcs[0];
        
        
        this.onupdate=function (){
            entityCollide.call(this);

            if(Math.floor(Math.abs(this.yv))>1){
                if(this.yv>0){
                    this.img.src=this.imgsrcs[1+this.facingRight][playerFrameMap.fall];
                } else {
                    this.img.src=this.imgsrcs[1+this.facingRight][playerFrameMap.jump];
                }
            } else {
                if(Math.floor(Math.abs(this.xv))<2){
                    this.img.src=this.imgsrcs[1+this.facingRight][playerFrameMap.stand];
                } else {
                    this.img.src=this.imgsrcs[1+this.facingRight][playerFrameMap.walk[this.walkFrame]];
                    this.walkFrame++;
                    if(this.walkFrame>7){
                        this.walkFrame=0;
                    }
                }
            }
            if (key.up) {
                sprites.forEach(
                    function(x){
                        if(x!=this && this.hascollision && x.hascollision &&(x.x>scrn.x-200 && x.x<scrn.x+width+200 && x.y>scrn.y-200 &&                     x.y<scrn.y+height+200)){

                            //console.log(x);
                            if(x.hitbox.collide(this.hitbox)&&Math.abs((this.hitbox.cx()-x.hitbox.cx())/(x.hitbox.w/this.hitbox.w))
                               <Math.abs((this.hitbox.cy()-x.hitbox.cy())*(x.hitbox.h/this.hitbox.h))){
                                this.yv=-45;
                                game_audio.jump.play();
                            }
                        }
                    },
                    this
                );
            }
            if (key.left) {
                if(this.xv>-8){this.xv=this.xv-2;}
                this.facingRight=false;
            }
            if (key.right) {
                if(this.xv<8){this.xv=this.xv+2;}
                this.facingRight=true;
            }

            if(this.x<scrn.x){
                this.x=scrn.x;
            }
            if(this.y<scrn.y){
                this.y=scrn.y;
            }
            if(this.x>scrn.x+width-this.w){
                this.x=scrn.x+width-this.w;
            }
            if(this.y>scrn.y+height-this.h){
                this.y=scrn.y+height-this.h;
                death();
            }
            gravity.call(this);

        };
    }
}

class spring extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/spring/spring_0.png","assets/spring/spring_1.png"]);
        this.activate=()=>{
            this.img.src=this.imgsrcs[1];
            setTimeout(function(){
                this.img.src=this.imgsrcs[0];
            }.bind(this),20);
            new Audio(game_audio.spring).play();
        };
        this.onupdate=()=>{
            //console.log(this.yv);
            entityCollide.call(this);
            gravity.call(this);
        };
    }
}

class sign_base extends sprite{
    constructor(x,y,text){
        super(x,y,TILE_SIZE,TILE_SIZE,["assets/tutorial/sign1.png"],false);
        this.text=text;
        this.onupdate=()=>{
            if(this.hitbox.collide(player.hitbox)){
                //window.setTimeout(function(){
                    ctx.fillStyle="#101010";
                    ctx.font="40px VT323";
                    ctx.textAlign="center";
                    ctx.fillText(this.text,width/2,100);
                //}.bind(this),0);
            }
        }
    }
    static getSign(text){
        return(
            class extends sign_base{
                constructor(x,y){
                    super(x,y,text);
                }
            }
        );
    }
}

class snail extends sprite{
    constructor(x,y){
        super(x,y,TILE_SIZE,TILE_SIZE*0.75,["assets/enemies/snail/snail_0.png","assets/enemies/snail/snail_1.png"],false);
        this.facingRight=false;
        this.onupdate=function(){
            this.img.src=this.imgsrcs[+this.facingRight];
            
            entityCollide.call(this,true);
            gravity.call(this);
            
            if(player.x<this.x){
                this.facingRight=false;
                this.xv=-5;
            } else {
                this.facingRight=true;
                this.xv=5;
            }
            if(this.hitbox.collide(player.hitbox)){
                if(Math.floor(player.yv)>2){
                    SCORE+=5;
                    sprites.splice(sprites.indexOf(this),1);
                    new Audio(game_audio.coin).play();
                    player.yv=-20;
                    if(key.up){
                        player.yv=-55;
                    }
                } else {
                    death();
                }
            }
            //this.xv=-5;
        };
    }
}

tilesets={
    "grassland":[
        grass_0,grass_1,grass_2,grass_3,grass_4,grass_5,grass_6,grass_7,grass_8,grass_9,grass_10,grass_11,grass_12,grass_13,grass_14,grass_15,grass_16,coin_crate,coin,spring,getPortal(door,1),spikes,
        sign_base.getSign("Hello! Use the arrow keys to move left and right"),
        sign_base.getSign("Use the up arrow key to jump! Hey look, a spring!  Try jumping on it."),
        sign_base.getSign("Look! A crate! Press SPACE to interact with objects."),
        sign_base.getSign("A door! Enter it with SPACE."),
        sign_base.getSign("Watch out for spikes!"),
        sign_base.getSign("Oh no! A possessed snail! Stomp on it to kill it (or you can not, ig)."),
        snail,
        getPortal(door,2),
        getPortal(red_gem,3)
    ]
};