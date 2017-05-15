 var Enemigo = cc.Class.extend({
    tiempoUtimoSalto:0,
    tiempoEntreSaltos:0,
    gameLayer:null,
    sprite:null,
    body:null,
    shape:null,
    velBase: 40,
    orientacionX: -1,
    orientacionY: 0,
    persiguiendo: false,
    impactado: false,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;

    this.tiempoEntreSaltos = 2 + Math.floor(Math.random() * 2);
    // Crear animación
    var framesAnimacion = [];
    for (var i = 1; i <= 8; i++) {
        var str = "cuervo" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle = new cc.RepeatForever(new cc.Animate(animacion));

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#cuervo1.png");
    // Cuerpo estática , no le afectan las fuerzas
    // Cuerpo dinámico, SI le afectan las fuerzas
    this.body = new cp.Body(8, cp.momentForBox(1,16,16));

    this.body.setPos(posicion);
    this.body.setAngle(0);
    this.sprite.setBody(this.body);
    // Se añade el cuerpo al espacio
    gameLayer.space.addBody(this.body);

    // forma
    this.shape = new cp.BoxShape(this.body, this.sprite.getContentSize().width - 16, this.sprite.getContentSize().height - 16);
    this.shape.setCollisionType(tipoEnemigo);
    this.shape.gestor = this;
    // agregar forma dinamica
    gameLayer.space.addShape(this.shape);
    // añadir sprite a la capa

    // ejecutar la animación
    this.sprite.runAction(actionAnimacionBucle);

    gameLayer.addChild(this.sprite,10);
    this.body.applyImpulse(cp.v(-this.velBase, 0), cp.v(0, 0));

}, update:function (dt, jugador) {
    if(!this.impactado)
	this.body.setAngle(0);
    if(!this.persiguiendo && !this.impactado){ //Debe moverse en horizontal o en vertical.
        if(Math.abs(this.body.getVel().x) >= Math.abs(this.body.getVel.y)){
            this.body.setVel(cp.v(this.velBase,0));
            orientacionY = 0;
            if(this.body.getVel().x > 0)
                orientacionX = 1;
            else
                orientacionX = -1;
        }else{
            this.body.setVel(cp.v(0, this.velBase));
            orientacionX = 0;
            if(this.body.getVel().y > 0)
                orientacionY = 1;
            else
                orientacionY = -1;
        }
    }
    var distanciaX = jugador.body.p.x - this.body.p.x;
    var distanciaY = jugador.body.p.y - this.body.p.y;
    var absx = Math.abs(distanciaX);
    var absy = Math.abs(distanciaY);
    var distancia = Math.sqrt(Math.pow(absx,2)+Math.pow(absy,2));
    if(distancia < 150 && !this.impactado){
        this.persiguiendo = true;
        var velocidadX;
        var velocidadY;
        var velocidadBase = Math.abs(this.velBase);
        var factor = 0;
        if(distanciaX >= 0)
            this.orientacionX = 1;
        else
            this.orientacionX = -1;
        if(distanciaY >= 0)
            this.orientacionY = 1;
        else
            this.orientacionY = -1;
        distanciaX = absx;
        distanciaY = absy;
        if(distanciaX > distanciaY){
            factor = distanciaX/distanciaY;
            var vB = velocidadBase * velocidadBase;
            factor = 1 + (factor * factor);
            velocidadY = vB / factor;
            velocidadY = Math.sqrt(velocidadY);
            velocidadX = velocidadBase - velocidadY;
        }else{
            factor = distanciaY/distanciaX;
            var vB = velocidadBase * velocidadBase;
            factor = 1+ (factor * factor);
            velocidadX = vB / factor;
            velocidadX = Math.sqrt(velocidadX);
            velocidadY = velocidadBase - velocidadX;
        }
        velocidadX = velocidadX * this.orientacionX;
        velocidadY = velocidadY * this.orientacionY;
        this.body.setVel(cp.v(velocidadX,velocidadY));
    }else{
        this.persiguiendo = false;
    }
}, colisionMuro:function(){
    this.orientacionX *= -1;
    this.orientacionY *= -1;
    this.velBase *= -1;
    this.impactado = false;
}, colisionProyectil:function(){
    this.impactado = true;
    this.sprite.runAction(this.gameLayer.anims.secuencia_damage.clone());
}, eliminar:function(){
    this.gameLayer.space.removeShape(this.shape);
    this.gameLayer.space.removeBody(this.body);
    this.gameLayer.removeChild(this.sprite);
    var t = cc.Sprite.create(null);
    t.setScale(0.5);
    t.setPosition(cc.p(this.body.p.x-32,this.body.p.y-32));
    this.gameLayer.addChild(t);
    t.runAction(this.gameLayer.anims.aExplosion.clone());
    t.runAction(this.gameLayer.anims.secuencia_explosion.clone()); //clone() porque no pueden compartirse
}

});
