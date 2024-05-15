var xWanted = -1;
var yWanted = -1;

function drawSingleCritter(app, texture, isWanted) {
    var x, y;

    do {
        x = getRandomInt(app.screen.width - 50);
        y = 340 + getRandomInt(app.screen.height - 390); 
    } while(!isWanted && isSpriteTooClose(x, y))

    if(isWanted) {
        xWanted = x;
        yWanted = y;
    }

    const sprite = drawSprite(app, texture, x, y);
    sprite.width /= 1.5;
    sprite.height /= 1.5;
    sprite.eventMode = 'static';
    sprite.cursor = 'pointer';
    sprite.on('pointerdown', onClick);

    app.ticker.add((time) =>
    {
        // Idea for a future update... :3
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

function isSpriteTooClose(x, y) {
    var xGap = Math.abs(x - xWanted);
    var yGap = Math.abs(y - yWanted);

    return xGap < 5 && yGap < 5;
}

function playAudio(audiofile, volume) {
    if(volume == undefined) {
        volume = 0.1;
    }
    var audio = new Audio("sound/" + audiofile);
    audio.volume = volume;
    audio.play();
}