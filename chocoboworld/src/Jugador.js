var estadoCaminando = 1;
var estadoSaltando = 2;
var parado = 0;
var caminandoAbajo = 1;
var caminandoArriba = 2;
var caminandoDerecha = 3;
var caminandoIzquierda = 4;

var Jugador = cc.Class.extend({
    estado: null,
    gameLayer:null,
    anims:null,
    sprite:null,
    shape:null,
    body:null,
    akActual:null,
    velBase:800,
    puntos: 0,
    vidas: 5,
    tInmunidad: 0,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;
    this.anims = this.gameLayer.anims;


    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite(res.chocobo_abajo);
    this.akActual = this.anims.akAbajo.clone();
    // Cuerpo dinámico, SI le afectan las fuerzas
    this.body = new cp.Body(5, cp.momentForBox(999999999999,
        this.sprite.getContentSize().width,
        this.sprite.getContentSize().height));
    this.body.setPos(posicion);
    //body.w_limit = 0.02;
    this.body.setAngle(0);
    this.sprite.setBody(this.body);

    // Se añade el cuerpo al espacio
    gameLayer.space.addBody(this.body);


    // forma 16px más pequeña que la imagen original
    this.shape = new cp.BoxShape(this.body,
    this.sprite.getContentSize().width*0.2,
    this.sprite.getContentSize().height*0.2);
    this.sprite.setScale(0.2);
    this.shape.gestor = this;
    this.shape.setCollisionType(tipoJugador);

    // forma dinamica
    gameLayer.space.addShape(this.shape);
    // ejecutar la animación

    // añadir sprite a la capa
    gameLayer.addChild(this.sprite,10);



}, caminarAbajo: function(){
    this.sprite.runAction(this.anims.acAbajo.clone());
    this.estado = caminandoAbajo;
    this.akActual = this.anims.akAbajo.clone();
}, caminarArriba: function(){
     this.sprite.runAction(this.anims.acArriba.clone());
     this.estado = caminandoArriba;
     this.akActual = this.anims.akArriba.clone();
}, caminarDerecha: function(){
     this.sprite.runAction(this.anims.acDerecha.clone());
     this.estado = caminandoDerecha;
     this.akActual = this.anims.akDerecha.clone();
}, caminarIzquierda: function(){
     this.sprite.runAction(this.anims.acIzquierda.clone());
     this.estado = caminandoIzquierda;
     this.akActual = this.anims.akIzquierda.clone();
}, kue: function(){
    var kue1 = false;
    var kue2 = false;
    var kue3 = false;
    var rt = 0;
    this.sprite.runAction(this.akActual);
    var tesoros = this.gameLayer.tesoros;
    for(var i = 0; i < tesoros.length; i++){
        var absx = Math.abs(tesoros[i].posX - this.body.p.x);
        var absy = Math.abs(tesoros[i].posY - this.body.p.y);
        var distancia = Math.sqrt(Math.pow(absx,2)+Math.pow(absy,2));
        if(distancia < 400 && rt == 0)
            rt = 1;
        if(distancia < 100 && rt <= 2)
            rt = 2;
        if(distancia < 20 && rt <=3){ //Tesoro encontrado
            this.puntos = this.puntos + tesoros[i].puntos;
            this.gameLayer.cargarTesoroSprite(i);
            cc.audioEngine.playEffect(res.chocobo_kue_wav);
            return "K-Kueeeee!!!!!";    //retornamos directamente para no buscar mas
        }
    }
    return (rt == 0) ? "kue.." : (rt == 1 ) ? "kue!?" : "kueeee!!??";
},atacar: function(tipo){
    cc.audioEngine.playEffect(res.fire_ogg);
    var p = null;
    if(this.puntos < 200)
        p = new Proyectil(this.gameLayer,this.body.p,this.estado, tipo );
    else
        p = new Proyectil(this.gameLayer,this.body.p,this.estado, tipo+1 );
    this.gameLayer.proyectiles.push(p);
},restablecer: function(){

},tocaMuro: function(){

},damaged: function(){
    if(this.tInmunidad < new Date().getTime()){
        this.sprite.runAction(this.anims.secuencia_damage.clone());
        this.puntos = this.puntos - 100;
        this.vidas -= 1;
        this.gameLayer.controlesLayer.eliminarVida();
        this.tInmunidad = new Date().getTime()+3200;
        if(this.vidas <= 0)
            cc.director.runScene(new MenuScene());
    }
},tintar: function(){
    //this.sprite.runAction(this.anims.secuencia_tint);
}
});
