var tipoMuro = 1;
var tipoBosque = 2;
var tipoAgua = 3;
var tipoJugador = 4;
var tipoProyectil = 5;
var tipoEnemigo = 6;
var NUM_TESOROS = 20;
var GameLayer = cc.Layer.extend({
    controlesLayer: null,
    anims: null,
    _emitter: null,
    tiempoEfecto:0,
    tesoros:[],
    proyectiles:[],
    enemigos:[],
    formasEliminar:[],
    jugador: null,
    space: null,
    mapa: null,
    mapaAncho: null,
    mapaAlto: null,
    time: 0,

ctor:function () {
    this._super();
    var size = cc.winSize;

    cc.spriteFrameCache.addSpriteFrames(res.chocobo_anim_plist);
    cc.spriteFrameCache.addSpriteFrames(res.chocobo_kue_plist);
    cc.spriteFrameCache.addSpriteFrames(res.animacion_bola_plist);
    cc.spriteFrameCache.addSpriteFrames(res.animacion_cuervo_izquierda_plist);
    cc.spriteFrameCache.addSpriteFrames(res.animacion_explosion_plist);
    this.anims = new Animaciones(this);
    //Guión página 5
   this.space = new cp.Space();
   this.space.gravity = cp.v(0, 0);
    // Depuración
    this.depuracion = new cc.PhysicsDebugNode(this.space);
    this.addChild(this.depuracion, 10);

    this.jugador = new Jugador(this, cc.p(size.width/2, size.height/2));
    this.cargarMapa();
    this.generarTesoros();
    this.scheduleUpdate();

    // suelo y jugador
    this.space.addCollisionHandler(tipoMuro, tipoJugador, null, null, this.collisionMuroConJugador.bind(this), null);
    this.space.addCollisionHandler(tipoMuro, tipoEnemigo, null, null, this.collisionMuroConEnemigo.bind(this), null);
    this.space.addCollisionHandler(tipoAgua, tipoJugador, null, null, this.collisionAguaConJugador.bind(this), null);
    this.space.addCollisionHandler(tipoJugador, tipoEnemigo, null, null, this.collisionJugadorConEnemigo.bind(this), null);
    this.space.addCollisionHandler(tipoProyectil, tipoEnemigo, null, null, this.collisionProyectilConEnemigo.bind(this), null);
    this.space.addCollisionHandler(tipoProyectil, tipoMuro, null, null, this.collisionProyectilConMuro.bind(this), null);

    // Declarar emisor de particulas (parado)
    this._emitter =  new cc.ParticleGalaxy.create();
    this._emitter.setEmissionRate(0);
    //this._emitter.texture = cc.textureCache.addImage(res.fire_png);
    this._emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;
    this.addChild(this._emitter,10);


    return true;

},
 /*                                         Función Update de la Layer
 ###################################################################################################################
 ###################################################################################################################
      */
update:function (dt){

    this.space.step(dt);
    for (var i = 0; i < this.enemigos.length; i++) {
        this.enemigos[i].update(dt, this.jugador);
    }
    for (var i = 0; i < this.proyectiles.length; i++) {
        this.proyectiles[i].update(dt);
    }
    for(var i = 0; i < this.formasEliminar.length; i++) {
        this.formasEliminar[i].gestor.eliminar();
    }
    this.formasEliminar = [];

    // Control de emisor de partículas
        if (this.tiempoEfecto > 0){
             this.tiempoEfecto = this.tiempoEfecto - dt;
             this._emitter.x =  this.jugador.body.p.x;
             this._emitter.y =  this.jugador.body.p.y;

        }
        if (this.tiempoEfecto < 0) {
             this._emitter.setEmissionRate(0);
             this.tiempoEfecto = 0;
        }
    // Controlar el angulo (son radianes) max y min.
    if ( this.jugador.body.a > 0.44 ){
        this.jugador.body.a = 0.44;
    }
    if ( this.jugador.body.a < -0.44){
        this.jugador.body.a = -0.44;
    }

    this.controlesLayer.actualizarPuntos();
    // SCROLL
    var posicionXJugador = this.jugador.body.p.x - cc.winSize.width/2;
    var posicionYJugador = this.jugador.body.p.y - cc.winSize.height/2;
    this.setPosition(cc.p( -posicionXJugador,-posicionYJugador));

},
/*
                                            Función cargar Mapa
*/
cargarMapa:function () {
    //Esta procesa este formato de mapa
    this.mapa = new cc.TMXTiledMap(res.mapa1_tmx);
    // Añadirlo a la Layer
    this.addChild(this.mapa);
    // Ancho del mapa
    this.mapaAncho = this.mapa.getContentSize().width;
    this.mapaAlto = this.mapa.getContentSize().height;
    /*
                                CARGAR MUROS
    */
    // Solicitar los objeto dentro de la capa Suelos
    var grupoSuelos = this.mapa.getObjectGroup("muros");
    var suelosArray = grupoSuelos.getObjects();

    // Los objetos de la capa suelos se transforman a
    // formas estáticas de Chipmunk ( SegmentShape ).
    for (var i = 0; i < suelosArray.length; i++) {
        var suelo = suelosArray[i];
        var puntos = suelo.polylinePoints;
        for(var j = 0; j < puntos.length - 1; j++){
            var bodyMuro = new cp.StaticBody();
            var shapeMuro = new cp.SegmentShape(bodyMuro,
                cp.v(parseInt(suelo.x) + parseInt(puntos[j].x),
                    parseInt(suelo.y) - parseInt(puntos[j].y)),
                cp.v(parseInt(suelo.x) + parseInt(puntos[j + 1].x),
                    parseInt(suelo.y) - parseInt(puntos[j + 1].y)),
                1);
            shapeMuro.setCollisionType(tipoMuro);
            shapeMuro.setFriction(0);
            this.space.addStaticShape(shapeMuro);
        }
    }

    var grupoAguas = this.mapa.getObjectGroup("aguas");
    var aguasArray = grupoAguas.getObjects();
    for (var i = 0; i < aguasArray.length; i++) {
        var aguas = aguasArray[i];
        var puntos = aguas.polylinePoints;
        for(var j = 0; j < puntos.length-1; j++){
            var bodyAgua = new cp.StaticBody();
            var shapeAgua = new cp.SegmentShape(bodyAgua,
                cp.v(parseInt(aguas.x) + parseInt(puntos[j].x),
                    parseInt(aguas.y) - parseInt(puntos[j].y)),
                cp.v(parseInt(aguas.x) + parseInt(puntos[j + 1].x),
                    parseInt(aguas.y) - parseInt(puntos[j + 1].y)),
                1);
            shapeAgua.setCollisionType(tipoAgua);
            shapeAgua.setFriction(0);
            this.space.addShape(shapeAgua);
        }
    }

    var grupoEnemigos = this.mapa.getObjectGroup("enemigos");
    var enemigosArray = grupoEnemigos.getObjects();
    for (var i = 0; i < enemigosArray.length; i++) {
        var enemigo = new Enemigo(this,
            cc.p(enemigosArray[i]["x"],enemigosArray[i]["y"]));

        this.enemigos.push(enemigo);
    }

}, generarTesoros: function(){                                      //Generación de tesoros
    for(var i = 0; i < NUM_TESOROS; i++){
        var x = Math.floor((Math.random() * this.mapaAncho) + 1);
        var y = Math.floor((Math.random() * this.mapaAlto) + 1);
        var puntos = Math.floor((Math.random() * 80) + 1)
        var tesoro = new Tesoro();
        tesoro.posX = x;
        tesoro.posY = y;
        tesoro.puntos = puntos;
        this.tesoros.push(tesoro);
    }
}, cargarTesoroSprite(index){
    cc.audioEngine.playEffect(res.win_ogg);
    this.tesoros.splice(index,1);
    var t = cc.Sprite.create(res.tesoro_png);
    t.setScale(0.05);
    t.setPosition(this.jugador.body.p );
    this.addChild(t);
    t.runAction(this.anims.secuencia_tesoro_popup.clone());
},collisionMuroConJugador:function (arbiter, space) {
    this.jugador.tocaMuro();
},collisionAguaConJugador:function (arbiter, space){
    this.jugador.tintar();
},collisionMuroConEnemigo:function(arbiter, space){
    var shapes = arbiter.getShapes();
    var enemigo = shapes[1].gestor;
    enemigo.colisionMuro();
},collisionJugadorConEnemigo:function(arbiter, space){
    this.jugador.damaged();
},collisionProyectilConEnemigo:function(arbiter, space){
    var shapes = arbiter.getShapes();
    shapes[0].body.setVel(cp.v(0, 0));
    var tipo = shapes[0].gestor.tipo;
    if(shapes[0].gestor.toRemove == false){
        if(tipo == 1){  //Empujamos enemigo y destruimos proyectil
            shapes[1].gestor.colisionProyectil();
            this.formasEliminar.push(shapes[0]);
            shapes[0].gestor.toRemove = true;
            this.jugador.puntos += 2;
        }
        if(tipo == 2){
            this.formasEliminar.push(shapes[0]);
            this.formasEliminar.push(shapes[1]);
            shapes[0].gestor.toRemove = true;
            this.jugador.puntos -= 5;
        }
        if(tipo == 3){
            shapes[1].gestor.colisionProyectil();
        }
        if(tipo == 4){
            this.formasEliminar.push(shapes[1]);
        }
    }

},collisionProyectilConMuro:function(arbiter, space){
    var shapes = arbiter.getShapes();
    if(shapes[0].gestor.toRemove == false){ //Solo lo eliminamos una vez.
        shapes[0].gestor.toRemove = true;
        this.formasEliminar.push(shapes[0]);
    }
    shapes[0].body.setVel(cp.v(0, 0));

},restablecer: function(){
    var capaControles = this.getParent().getChildByTag(idCapaControles);
    this.jugador.restablecer();
    capaControles.restablecerVida();
}
});

/*
    Cargamos la música en la escena, no en la layer de esta.
*/

var idCapaJuego = 1;
var idCapaControles = 2;
var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer, 0, idCapaJuego);
        var controlesLayer = new ControlesLayer(layer);
        layer.controlesLayer = controlesLayer;
        this.addChild(controlesLayer, 0, idCapaControles);
        this.cargarMusica();
    }, cargarMusica: function(){
        cc.audioEngine.playMusic(res.chocobo_song_wav,true);
    }
});
