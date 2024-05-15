function drawSingleCritter(app, texture) {
    var x = getRandomInt(app.screen.width - 50);
    var y = 340 + getRandomInt(app.screen.height - 390); 

    const sprite = drawSprite(app, texture, x, y);
    sprite.width /= 1.5;
    sprite.height /= 1.5;
    sprite.eventMode = 'static';
    sprite.cursor = 'pointer';
    sprite.on('pointerdown', onClick);

    app.ticker.add((time) =>
    {
        //sprite.rotation += 0.1 * time.deltaTime;
    });

    return sprite;
}

function drawSprite(app, texture, x, y) {
    const sprite = new PIXI.Sprite(texture);
    app.stage.addChild(sprite);
    sprite.x = x;
    sprite.y = y;
    sprite.anchor.set(0.5);
    return sprite;
}

function playAudio(audiofile) {
    var audio = new Audio("sound/" + audiofile);
    audio.volume = 0.1;
    audio.play();
}