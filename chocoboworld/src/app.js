/*
    La escena es similar a una pantalla.
    En este caso tenemos La escena de Menú, en GameScena.js también está la scene del juego.
    Las Layers, son capas que se almacenan dentro de la escena.
    Estas contienen todos los elementos del juego.
*/
var MenuLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        var size = cc.winSize;

        // Fondo
        var spriteFondoTitulo= new cc.Sprite(res.menu_titulo_png);
        // Asigno posición central
        spriteFondoTitulo.setPosition(cc.p(size.width / 2, size.height / 2));
        // Lo escalo porque es más pequeño que la pantalla
        spriteFondoTitulo.setScale(size.height / spriteFondoTitulo.height);
        // Añado Sprite a la escena (¿Se lo añadimos a la layer que luego se añade a la scene?)
        this.addChild(spriteFondoTitulo);

        //MenuItemSprite para cada botón
        var menuBotonJugar = new cc.MenuItemSprite(
            new cc.Sprite(res.boton_jugar_png), // IMG estado normal
                new cc.Sprite(res.boton_jugar_png), // IMG estado pulsado
                    this.pulsarBotonJugar, this);   //Aquí le mandamos la función que implementa evento!!!

        // creo el menú pasándole los botones
        var menu = new cc.Menu(menuBotonJugar);
        // Asigno posición central
        menu.setPosition(cc.p(size.width / 2, size.height * 0.25));
        // Añado el menú a la escena
        this.addChild(menu);

        return true;

    }, pulsarBotonJugar : function(){
        cc.director.runScene(new GameScene());
    }

});

/*
    La creación de scene usa cc que parece el punto de acceso al framework
    Hacemos una herencia de la clase Scene definida en cc y sobrescribimos la función onEnter()
*/
var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        this.addChild(layer);
    }
});

