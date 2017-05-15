/* Adrián García Bueno - Enero de 2017
En esta clase almaceno las animaciones y las secuencias.
Es preciso realizar un clone() al coger estos objetos
puedes deben tener algún tipo de estado interno y si son usados a la vez hace cosas raras.
*/
var Animaciones = cc.Class.extend({
    gameLayer:null,
    //Animaciones
    acArriba:null,
    acAbajo:null,
    acDerecha:null,
    acIzquierda:null,
    akArriba:null,
    akAbajo:null,
    akDerecha:null,
    akIzquierda:null,
    aBola:null,
    aExplosion:null,
    //Secuencias
    secuencia_tint:null,
    secuencia_bola_2: null,
    secuencia_impactado:null,
    secuencia_damage:null,
    secuencia_explosion: null,
    secuencia_text_att: null,
    secuencia_text_popup: null,
    secuencia_text_fin: true,
    secuencia_tesoro_popup: null,
    secuencia_tesoro_fin: false,
ctor:function (gameLayer) {
    this.cargarAnimaciones();
    this.cargar_secuancia_text_popup();
    this.cargar_secuencia_text_att();
    this.cargar_secuencia_tesoro_popup();
    this.cargar_sencuencia_explosion();
    this.cargar_secuencia_damage();
    this.cargar_secuencia_bola_2();
    this.cargar_secuencia_tint();
}, cargarAnimaciones: function (){
    // Crear animaciones    CAMINANDO
    var framesAnimacion = [];
    var animacion;
    for (var i = 1; i <= 4; i++) {
        var str = "chocobo_abajo" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    animacion = new cc.Animation(framesAnimacion, 0.2);
    this.acAbajo = new cc.RepeatForever(new cc.Animate(animacion));
    this.acAbajo.retain();
    framesAnimacion = [];
    for (var i = 1; i <= 4; i++) {
        var str = "chocobo_arriba" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    animacion = new cc.Animation(framesAnimacion, 0.2);
    this.acArriba = new cc.RepeatForever(new cc.Animate(animacion));
    this.acArriba.retain();
    framesAnimacion = [];
    framesAnimacionFlip = [];
    for (var i = 1; i <= 4; i++) {
        var str = "chocobo_derecha" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    animacion = new cc.Animation(framesAnimacion, 0.2);
    this.acDerecha = new cc.RepeatForever(new cc.Animate(animacion));
    this.acDerecha.retain();
    framesAnimacion = [];
    for (var i = 1; i <= 4; i++) {
        var str = "chocobo_izquierda" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    animacion = new cc.Animation(framesAnimacion, 0.2);
    this.acIzquierda = new cc.RepeatForever(new cc.Animate(animacion));
    this.acIzquierda.retain();
    // Crear animaciones    KUEEE
    framesAnimacion = [];
    for (var i = 1; i <= 3; i++) {
        var str = "chocobo_kue_abajo" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    animacion = new cc.Animation(framesAnimacion, 0.1);
    this.akAbajo = new cc.repeat(new cc.Animate(animacion),1);
    this.akAbajo.retain();
    framesAnimacion = [];
    for (var i = 1; i <= 3; i++) {
        var str = "chocobo_kue_izquierda" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    animacion = new cc.Animation(framesAnimacion, 0.1);
    this.akIzquierda = new cc.repeat(new cc.Animate(animacion),1);
    this.akIzquierda.retain();
    framesAnimacion = [];
    for (var i = 1; i <= 3; i++) {
        var str = "chocobo_kue_derecha" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    animacion = new cc.Animation(framesAnimacion, 0.1);
    this.akDerecha = new cc.repeat(new cc.Animate(animacion),1);
    this.akDerecha.retain();
    framesAnimacion = [];
    for (var i = 1; i <= 3; i++) {
        var str = "chocobo_kue_arriba" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    animacion = new cc.Animation(framesAnimacion, 0.1);
    this.akArriba = new cc.repeat(new cc.Animate(animacion),1);
    this.akArriba.retain();
    framesAnimacion = [];
    for (var i = 1; i <= 6; i++) {
        var str = "animacion_bola" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    animacion = new cc.Animation(framesAnimacion, 0.1);
    this.aBola = new cc.RepeatForever(new cc.Animate(animacion));
    this.aBola.retain();
    framesAnimacion = [];
    for (var i = 1; i <= 5; i++) {
        var str = "animacion_explosion" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    animacion = new cc.Animation(framesAnimacion, 0.2);
    this.aExplosion = new cc.repeat(new cc.Animate(animacion),1);
    this.aExplosion.retain();

}, func_move:function(){


}, cargar_secuencia_bola_2(){ //Experimental
    /*var radio = 30;
    var rad = Math.PI / 2;

    var x = radio * Math.cos(rad);
    var y = radio * Math.sin(rad);

    var mov1 = cc.MoveBy.create(0.2, cc.p(-x, y));
    var mov2 = cc.MoveBy.create(0.2, cc.p(-x, y));

    var mov3 = cc.MoveBy.create(0.2, cc.p(-x, -y));
    var mov4 = cc.MoveBy.create(0.2, cc.p(-x, -y));

    var mov5 = cc.MoveBy.create(0.2, cc.p(x, -y));
    var mov6 = cc.MoveBy.create(0.2, cc.p(x, -y));

    var mov7 = cc.MoveBy.create(0.2, cc.p(x, y));
    var mov8 = cc.MoveBy.create(0.2, cc.p(x, y));

    var movs = [];
    for(var i = 0 ; i < 20 ; i++){
        movs.push(mov1);
        movs.push(mov2);
        movs.push(mov3);
        movs.push(mov4);
        movs.push(mov5);
        movs.push(mov6);
        movs.push(mov7);
        movs.push(mov8);
    }
    this.secuencia_bola_2 = cc.Sequence.create(movs);
    */
}, cargar_secuencia_impactado(){


},cargar_secuencia_tint(){
    var tint = cc.TintTo.create(20,0,0,200);
    this.secuencia_tint = cc.Sequence.create(tint);
},cargar_secuencia_damage(){
    var fadeIn = new cc.FadeIn(0.3);
    var delay = cc.DelayTime.create(0.3);
    var fadeOut = new cc.FadeOut(0.3);
    this.secuencia_damage = cc.Sequence.create(fadeOut,delay,fadeIn,delay, fadeOut,delay,fadeIn);
},cargar_sencuencia_explosion(){
    var delay = cc.DelayTime.create(2);
    var rem = cc.RemoveSelf.create();
    this.secuencia_explosion = cc.Sequence.create(delay, rem);
},cargar_secuencia_text_att(){
    var mov1 = cc.MoveBy.create(0.1, cc.p(8, 0));
    var mov2 = cc.MoveBy.create(0.1, cc.p(-8, 0));
    this.secuencia_text_att = cc.Sequence.create(mov1,mov2,mov1,mov2,mov1,mov2);

},cargar_secuancia_text_popup(){
    var mov1 = cc.MoveBy.create(0.3, cc.p(0, 20));
    var mov2 = cc.MoveBy.create(0.05, cc.p(3, 0));
    var mov3 = cc.MoveBy.create(0.05, cc.p(-3, 0));
    var rem = cc.RemoveSelf.create();
    var inicio = cc.CallFunc.create(this.inicio_secuencia_text, this);
    var fin = cc.CallFunc.create(this.fin_secuencia_text, this);
    this.secuencia_text_popup = cc.Sequence.create(inicio,mov1,mov2,mov3,mov2,mov3, rem, fin);
},cargar_secuencia_tesoro_popup(){
    var mov1 = cc.MoveBy.create(0.3, cc.p(0, 20));
    var mov2 = cc.MoveBy.create(0.05, cc.p(3, 0));
    var mov3 = cc.MoveBy.create(0.05, cc.p(-3, 0));
    //var rem = cc.RemoveSelf.create();
    this.secuencia_tesoro_popup = cc.Sequence.create(mov1,mov2,mov3,mov2,mov3);
},fin_secuencia_text: function(){
    this.secuencia_text_fin = true;
},inicio_secuencia_text: function(){
    this.secuencia_text_fin = false;
}

});