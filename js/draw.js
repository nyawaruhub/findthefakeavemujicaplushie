var xWanted = -1;
var yWanted = -1;

function drawSingleCritter(app, texture, roundQuirk, isWanted) {
    var x, y;

    do {
        x = 10 + getRandomInt(app.screen.width - 60);
        y = 340 + getRandomInt(app.screen.height - 390); 
        /*
            If the sprite is too close to the Wanted sprite,
            reroll. We don't want the Wanted sprite to be completely covered by another one
            There's no need to go through this process for the Wanted sprite,
            since it's generated before any other.
        */
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

    switch(roundQuirk) {
        case 0:
            app.ticker.add((time) =>
            {
                sprite.rotation += 0.02 * time.deltaTime;
            });
            break;
        case 1:
            app.ticker.add((time) => 
            {
                sprite.x++;
                if(sprite.x > app.screen.width) {
                    sprite.x = 0;
                }
            });
            break;
        case 2:
            app.ticker.add((time) => 
            {
                sprite.y++;
                if(sprite.y > app.screen.height) {
                    sprite.y = 340;
                }
            });
            break;
    }

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
    const min_distance = 10;
    var xGap = Math.abs(x - xWanted);
    var yGap = Math.abs(y - yWanted);

    return xGap < min_distance && yGap < min_distance;
}

function playAudio(audiofile, volume) {
    if(!playSounds) {
        return;
    }
    if(volume == undefined) {
        volume = 0.1;
    }
    var audio = new Audio("sound/" + audiofile);
    audio.volume = volume;
    audio.play();
}