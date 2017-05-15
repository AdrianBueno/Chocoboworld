/*
La funcionalidad está lista para añadir diferentes tipos de proyectiles.
*/
var Proyectil = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    body:null,
    shape:null,
    toRemove:false,
    direccion:null,
    anims:null,
    tipo: null,
    posicion: null,
    velBase: 2000,
    degree: 1,
    radio: 100,
ctor:function (gameLayer, posicion, direccion, tipo) {
    this.gameLayer = gameLayer;
    this.direccion = direccion;
    this.posicion = posicion;
    this.tipo = tipo;
    this.anims = this.gameLayer.anims;
    this.sprite = new cc.PhysicsSprite(null);
    var action;
    if(this.tipo == 1){
        this.body = new cp.Body(10, cp.momentForBox(5,32,32));
        this.sprite.setScale(1);
        this.shape = new cp.CircleShape(this.body, 8, cp.vzero);
    }else if(this.tipo == 2){
        this.body = new cp.Body(5, cp.momentForBox(5,48,48));
        this.sprite.setScale(1.2);
        this.shape = new cp.CircleShape(this.body, 16, cp.vzero);
    }else if(this.tipo == 3){
        this.body = new cp.Body(15, cp.momentForBox(5,48,48));
        this.sprite.setScale(1.2);
        this.shape = new cp.CircleShape(this.body, 16, cp.vzero);
    }else if(this.tipo == 4){
        this.body = new cp.Body(50, cp.momentForBox(5,48,48));
        this.sprite.setScale(1.2);
        this.shape = new cp.CircleShape(this.body, 24, cp.vzero);
    }

    this.shape.setCollisionType(tipoProyectil);
    this.shape.gestor = this;
    this.sprite.setBody(this.body);
    this.gameLayer.space.addShape(this.shape);
    this.gameLayer.space.addBody(this.body);
    var xpos = this.posicion.x;
    var ypos = this.posicion.y;
    this.sprite.setPosition(cc.p(xpos,ypos));
    this.gameLayer.addChild(this.sprite);
    this.sprite.body.applyImpulse(cp.v(0,0), cp.v(0,0));
    if(this.tipo == 1 || this.tipo == 2){
        if(this.direccion == caminandoAbajo)
            this.sprite.body.applyImpulse(cp.v(0,-this.velBase*this.tipo), cp.v(0,0));
        if(this.direccion == caminandoArriba)
            this.sprite.body.applyImpulse(cp.v(0,this.velBase*this.tipo), cp.v(0,0));
        if(this.direccion == caminandoDerecha)
            this.sprite.body.applyImpulse(cp.v(this.velBase*this.tipo,0), cp.v(0,0));
        if(this.direccion == caminandoIzquierda)
            this.sprite.body.applyImpulse(cp.v(-this.velBase*this.tipo,0), cp.v(0,0));
    }
    this.sprite.runAction(this.anims.aBola);
    //if(nivel > 1)
        //this.sprite.runAction(this.anims.secuencia_bola_2);

},update:function (dt){

    if(this.tipo == 3 || this.tipo == 4){
        var r = this.radio;
        var vx = r * Math.sin(this.degree*Math.PI/180);
        var vy = r * Math.cos(this.degree*Math.PI/180);
        if(this.degree >= 0 && this.degree < 90){
            vx = Math.abs(vx)*-1;
            vy = Math.abs(vy);
        }
        if(this.degree >= 90 && this.degree < 180){
            vx = Math.abs(vx)*-1;
            vy = Math.abs(vy)*-1;
        }
        if(this.degree >= 180 && this.degree < 270){
            vx = Math.abs(vx);
            vy = Math.abs(vy)*-1;
        }
        if(this.degree >= 270 && this.degree < 360){
            vx = Math.abs(vx);
            vy = Math.abs(vy);
        }
        this.body.setVel(cp.v(vx,vy));
        this.body.p = (cc.p(this.posicion.x + r * Math.cos(this.degree*Math.PI/180),this.posicion.y+ r * Math.sin(this.degree*Math.PI/180)));
        /*
        this.posicion.x + r * Math.cos(this.degree*Math.PI/180)
        r * Math.cos(this.degree*Math.PI/180)


        this.body.setPosition(cc.p(this.posicion.x + r * Math.cos(this.degree*Math.PI/180),this.posicion.y+ r * Math.sin(this.degree*Math.PI/180)));
*/
        if(this.degree >= 360)
            this.degree = 1;
        else
            this.degree = this.degree + 3*this.tipo;
    }
    if(this.tipo == 5){
        //for(var i = 0 ; i < this.gameLayer.enemigos.length; i++){
          /*
            Puedo copiar el código del método de actualización de enemigos para hacer un tipo de proyectil
            que persiga a los enemigos cuando estén cerca.
          */
        //}
    }



}, eliminar: function (){
    this.gameLayer.space.removeShape(this.shape);
    this.gameLayer.space.removeBody(this.body);
    this.gameLayer.removeChild(this.sprite);
    var t = cc.Sprite.create(null);
    t.setScale(0.5);
    t.setPosition(cc.p(this.body.p.x-32,this.body.p.y-32));
    this.gameLayer.addChild(t);
    t.runAction(this.anims.aExplosion);
    t.runAction(this.anims.secuencia_explosion.clone()); //clone() porque no pueden compartirse
}

});
