/* Hay 4 botones para eventos de ratón, pero el juego es más llevadero con el teclado
asique comento ese código para que no moleste en la pantalla.
*/
var idCapaJuego = 1;
var idCapaControles = 2;
var ControlesLayer = cc.Layer.extend({
    gameLayer:null,
    spriteBotonArriba:null,
    spriteBotonAbajo:null,
    spriteBotonDrecha:null,
    spriteBotonIzquierda:null,
    spriteMenuPausa:null,
    spriteArma:null,
    arma:1,
    etiquetaKue:null,
    etiquetaTesoros:null,
    enTransaccion:false,
    teclaPulsada:null,
    vidas:5,
    vidasSprites:[],
    pausa: false,
ctor:function (gameLayer) {
    this._super();
    this.gameLayer = gameLayer;
    this.gameLayer.controlesLayer = this;
    var size = cc.winSize;
    this.cargarBotones(size);
    this.cargarEtiquetas(size);

    for(var i = 0 ; i < this.vidas; i++){
        var t = cc.Sprite.create(res.vida_png);
        t.setPosition(cc.p(50+size.width*(0.05*i),size.height*0.95))
        t.setScale(0.1);
        this.addChild(t);
        this.vidasSprites.push(t);
    }
    this.seleccionarArma1();

    this.spriteMenuPausa = new cc.Sprite(res.menu_pausa_png);
    this.spriteMenuPausa.setPosition(cc.p(size.width / 2, size.height / 2));

   // Registrar Mouse Down
    cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,
        onMouseDown: this.procesarMouseDown
    }, this)
    //Registrar keyboard
    cc.eventManager.addListener({
        event: cc.EventListener.KEYBOARD,
        onKeyPressed: this.procesarTecladoDown,
        onKeyReleased: this.procesarTecladoReleased
    }, this);

    this.scheduleUpdate();
    return true;
},update:function (dt) {

},procesarMouseDown:function(event) {
    //var instancia = event.getCurrentTarget();
    //var areaBotonArriba = instancia.spriteBotonArriba.getBoundingBox();
    //var areaBotonAbajo = instancia.spriteBotonAbajo.getBoundingBox();
    //var areaBotonDerecha = instancia.spriteBotonDerecha.getBoundingBox();
    //var areaBotonIzquierda = instancia.spriteBotonIzquierda.getBoundingBox();
},procesarTecladoDown:function(keyCode, event){
    var instancia = event.getCurrentTarget();
    var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
    var anims = gameLayer.anims;
    if(keyCode == 90){ //Z
        if(gameLayer.jugador.puntos <= 0)    //No se permite atacar sin puntos
            instancia.etiquetaTesoros.runAction(anims.secuencia_text_att);
        else
            gameLayer.jugador.atacar(instancia.arma);
    }else if(keyCode == 88){ //X
        gameLayer.jugador.puntos += 20; //AÑADIR PUNTOS
    }else if(keyCode == 86){ //V
	if(gameLayer.jugador.puntos > 200){
		gameLayer.jugador.velBase += 100;
		gameLayer.jugador.puntos -= 200;
	}else{
		instancia.etiquetaTesoros.runAction(anims.secuencia_text_att);
	}
    }else if(keyCode == 49){ // Seleccionar arma 1
        instancia.seleccionarArma1();
    }else if(keyCode == 50){ // Seleccionar arma 2
        instancia.seleccionarArma3();
    }else if(keyCode == 27){ //PAUSA ESCAPE
        if(instancia.pausa){
            instancia.pausa = false;
            instancia.removeChild(instancia.spriteMenuPausa);
            cc.director.resume();
        }else{
            cc.director.pause();
            instancia.pausa = true;
            instancia.addChild(instancia.spriteMenuPausa);
        }
    }else if(instancia.teclaPulsada != keyCode && !instancia.enTransaccion){
        instancia.enTransaccion = true;
        var velBase = gameLayer.jugador.velBase;
        /*  Aquí se llama al método que hace la búsqueda de tesoros
            En función del retorno mostramos un label
            OJO: Este label s1e añade a la capa de controles no a la del jugador,
            el jugador está en medio de la pantalla asique damos esta posición ABSOLUTA
            La posición debe darse aquí siempre, no al instanciar, pues la secuencia text_popup la modifica.
            Solo se podrá entrar si no hay una secuencia text_popup activa en este momento
        */
        if(keyCode == 32 && anims.secuencia_text_fin){ // KUEEE Usando clone() podría quitar esto si hago de etiquetaKue instancias distintas.
            gameLayer.jugador.sprite.stopAllActions();
            gameLayer.jugador.body.setVel(cp.v(0, 0));
            var kue =  gameLayer.jugador.kue();
            instancia.etiquetaKue.setString(kue);
            instancia.etiquetaKue.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
            instancia.addChild(instancia.etiquetaKue);
            instancia.etiquetaKue.runAction(anims.secuencia_text_popup.clone());
            instancia.etiquetaTesoros.setString("Puntuación: "+gameLayer.jugador.puntos);
        }
        if(keyCode == 37){
            gameLayer.jugador.sprite.stopAllActions();
            gameLayer.jugador.body.setVel(cp.v(0, 0));
            gameLayer.jugador.caminarIzquierda();
            gameLayer.jugador.body.applyImpulse(cp.v(-velBase,0), cp.v(0,0));
        }
        if(keyCode == 39){
            gameLayer.jugador.sprite.stopAllActions();
            gameLayer.jugador.body.setVel(cp.v(0, 0));
            gameLayer.jugador.caminarDerecha();
            gameLayer.jugador.body.applyImpulse(cp.v(velBase,0), cp.v(0,0));
        }
        if(keyCode == 38){
            gameLayer.jugador.sprite.stopAllActions();
            gameLayer.jugador.body.setVel(cp.v(0, 0));
            gameLayer.jugador.caminarArriba();
            gameLayer.jugador.body.applyImpulse(cp.v(0,velBase), cp.v(0,0));
        }
        if(keyCode == 40){
            gameLayer.jugador.sprite.stopAllActions();
            gameLayer.jugador.body.setVel(cp.v(0, 0));
            gameLayer.jugador.caminarAbajo();
            gameLayer.jugador.body.applyImpulse(cp.v(0,-velBase), cp.v(0,0));
        }
        instancia.teclaPulsada = keyCode;
        instancia.enTransaccion = false;
    }
},procesarTecladoReleased:function(keyCode, event){
    var instancia = event.getCurrentTarget();
    var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
    if(instancia.teclaPulsada == keyCode && !instancia.enTransaccion){
        instancia.enTransaccion = true;
        if(keyCode == 32){ //SPACE
            gameLayer.jugador.body.setVel(cp.v(0, 0));
        } else{
            gameLayer.jugador.sprite.stopAllActions();
        }
        if(keyCode == 37){
            gameLayer.jugador.body.setVel(cp.v(0, 0));
        }
        if(keyCode == 39){
            gameLayer.jugador.body.setVel(cp.v(0, 0));
        }
        if(keyCode == 38){
            gameLayer.jugador.body.setVel(cp.v(0, 0));
        }
        if(keyCode == 40){
            gameLayer.jugador.body.setVel(cp.v(0, 0));
        }
        instancia.teclaPulsada = null;
        instancia.enTransaccion = false;
    }
},eliminarVida:function(){

    this.removeChild(this.vidasSprites[this.vidasSprites.length-1]);
    this.vidasSprites.splice(this.vidasSprites.length-1,1);
},cargarBotones:function(size){
    // Boton Arriba
    //this.spriteBotonArriba = cc.Sprite.create(res.boton_arriba_png);
    //this.spriteBotonArriba.setPosition(cc.p(size.width*0.8, size.height*0.7));
    //this.addChild(this.spriteBotonArriba);
    // Boton Abajo
    //this.spriteBotonAbajo = cc.Sprite.create(res.boton_abajo_png);
    //this.spriteBotonAbajo.setPosition(cc.p(size.width*0.8, size.height*0.5));
    //this.addChild(this.spriteBotonAbajo);
    // Boton Drecha
    //this.spriteBotonDerecha = cc.Sprite.create(res.boton_derecha_png);
    //this.spriteBotonDerecha.setPosition(cc.p(size.width*0.9, size.height*0.6));
    //this.addChild(this.spriteBotonDerecha);
    // Boton Izquierda
    //this.spriteBotonIzquierda = cc.Sprite.create(res.boton_izquierda_png);
    //this.spriteBotonIzquierda.setPosition(cc.p(size.width*0.7, size.height*0.6));
    //this.addChild(this.spriteBotonIzquierda);
},cargarEtiquetas:function(size){
    this.etiquetaKue = new cc.LabelTTF("", "Arial", 10);
    this.etiquetaKue.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    this.etiquetaKue.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
    this.etiquetaTesoros = new cc.LabelTTF("", "Arial", 10);
    this.etiquetaTesoros.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    this.etiquetaTesoros.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
    this.etiquetaTesoros.setString("Puntuación: 0");
    this.etiquetaTesoros.setPosition(cc.p(size.width*0.9, size.height*0.95))
    this.addChild(this.etiquetaTesoros);
},seleccionarArma1:function(){
    this.removeChild(this.spriteArma);
    this.spriteArma = cc.Sprite.create(res.bola_png);
    this.spriteArma.setPosition(cc.p(cc.winSize.width*(0.95),cc.winSize.height*0.1))
    this.spriteArma.setScale(1);
    this.addChild(this.spriteArma);
    this.arma = 1;

},seleccionarArma3:function(){
    this.removeChild(this.spriteArma);
    this.spriteArma = cc.Sprite.create(res.bola_protectora_png);
    this.spriteArma.setPosition(cc.p(cc.winSize.width*(0.95),cc.winSize.height*0.1))
    this.spriteArma.setScale(0.4);
    this.addChild(this.spriteArma);
    this.arma = 3;
}, actualizarPuntos:function(){
    this.etiquetaTesoros.setString("Puntuación: "+ this.gameLayer.jugador.puntos);
}
});
