var wantedSprite = undefined;
var hiddenPixels = 0;

function drawSingleCritter(app, texture, roundQuirk, isWanted) {
    var x, y;
    let yMinOffset = 340;
    if(isVerticalScreen()) {
        yMinOffset = 600;
    }

    do {
        x = 10 + getRandomInt(app.screen.width - 60);
        y = yMinOffset + getRandomInt(app.screen.height - yMinOffset); 
        /*
            If the sprite is too close to the Wanted sprite,
            reroll. We don't want the Wanted sprite to be completely covered by another one
            There's no need to go through this process for the Wanted sprite,
            since it's generated before any other.
        */
    } while(!isWanted && isSpriteTooClose(x, y))

    const sprite = drawSprite(app, texture, x, y);
    if(isVerticalScreen()) {
        sprite.width *= 1.7;
        sprite.height *= 1.7;
    } else {
        sprite.width /= 1.5;
        sprite.height /= 1.5;
    }
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
                    sprite.y = yMinOffset;
                }
            });
            break;
    }

    if(isWanted) {
        wantedSprite = sprite;
        hiddenPixels = 0;
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
    var width = wantedSprite.width;
    var height = wantedSprite.height;

    if(x <= wantedSprite.x - width || x >= wantedSprite.x + width || y <= wantedSprite.y - height || y >= wantedSprite.y + height) {
        // Not overlapping at all
        return false;
    }

    var occupiedX = 0;
    if(x < wantedSprite.x) {
        occupiedX = x + width - wantedSprite.x;
    } else {
        occupiedX = wantedSprite.x + width - x;
    }

    var occupiedY = 0;
    if(y < wantedSprite.y) {
        occupiedY = y + height - wantedSprite.y;
    } else {
        occupiedY = wantedSprite.y + height - y;
    }

    var numPixels = Math.max(0, occupiedX) * Math.max(0, occupiedY);
    // At least half of the sprite should always be visible!
    var maxPixelsHidden = (wantedSprite.width * wantedSprite.height) / 2;

    if(numPixels > maxPixelsHidden) {
        return true;
    } else {
        hiddenPixels += numPixels;
        return false;
    }

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

function isVerticalScreen() {
    return window.innerHeight * 0.6 > window.innerWidth
}