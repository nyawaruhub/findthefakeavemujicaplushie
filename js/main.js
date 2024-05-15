const app = new PIXI.Application();
var critterTextures = [];
var impostorTextures = [];
var innocentSprites = []
var wantedSprite = undefined;
var wantedSpriteSign = undefined;
var _score = 0;
var _time = 0;
var lblScore = undefined;
var lblTime = undefined;
var timerInterval = undefined;

document.addEventListener('DOMContentLoaded', function() {
    //initGame();
}, false);

function increaseScore() {
    _score++;
    lblScore.innerHTML = "Score: " + _score;

    var intervalCounter = 0;
    var increaseTimeInterval = setInterval(function() {
        _time++;
        lblTime.innerHTML = "Time: " + _time;
        intervalCounter++;
        playAudio('scoreup.wav');
        if(intervalCounter >= 5) {
            clearInterval(increaseTimeInterval);
        }
    }, 100);
}

async function initGame() {
    const playBtn = document.getElementById("playBtn");
    playBtn.style.display = "none";

    const divContent = document.getElementById("divContent");
    divContent.style.display = "block;"

    lblScore = document.getElementById("lblScore");
    lblTime = document.getElementById("lblTime");

    await app.init({ background: '#000000', width: 1280, height: 960 });
    app.canvas.style.display = "block";
    divContent.appendChild(app.canvas);

    var wantedTexture = await PIXI.Assets.load("img/Wanted.png");
    var wantedBgSprite = drawSprite(app, wantedTexture, app.screen.width / 2, 150);

    /*
    var count = 0;
    var musicPlayer = document.getElementById('music');
    musicPlayer.addEventListener('ended', function(){
        count++;
        if (count < 3) {
            this.currentTime = 0; // May be needed in some browsers to reset
            this.play();
        }
    }, false);
    musicPlayer.volume = 0.1;
    */

    var music = new Audio("music.mp3");
    music.volume = 0.1;
    music.addEventListener('ended', function(){
        music.play();
    }, false);
    music.play();

    const critterFiles = ["uikar.png", "nyamur.png", "mutsumir.png", "umirir.png", "sakikor.png"];
    const impostorFiles = ["uikaf.png", "nyamuf.png", "mutsumif.png", "umirif.png", "sakikof.png"];

    for(var file of critterFiles) {
        critterTextures.push(await PIXI.Assets.load("img/" + file));
    }

    for(var file of impostorFiles) {
        impostorTextures.push(await PIXI.Assets.load("img/" + file));
    }

    startGame();
}

function startGame() {
    _time = 10;
    _score = 0;
    lblScore.innerHTML = "Score: " + _score;
    lblTime.innerHTML = "Time: " + _time;
    
    startRound();
}

function lowerTime(seconds) {
    if(seconds == undefined) {
        seconds = 1;
        playAudio("clock.mp3");
    } else {
        playAudio("error.mp3");
    }
    _time -= seconds;
    if(_time < 0) {
        _time = 0;
    }
    lblTime.innerHTML = "Time: " + _time;
    checkForGameOver();
}

function startRound() {
    const crittersNum = (_score+1) * 4;

    const wantedCritterTexture = getRandomItem(impostorTextures);
    // Draw the Wanted impostor on the Wanted sign
    wantedSpriteSign = drawSprite(app, wantedCritterTexture, 640, 132);

    // Draw the Wanted sprite first so it can be overlapped and be harder to spot
    wantedSprite = drawSingleCritter(app, wantedCritterTexture);

    // Draw all the other sprites
    for(var i = 0; i < crittersNum - 1; i++) {
        innocentSprites.push(drawSingleCritter(app, getRandomItem(critterTextures)));
    }
    timerInterval = setInterval(lowerTime, 1000);
}

function checkForGameOver() {
    if(_time <= 0) {
        clearInterval(timerInterval);
        for(var innocentSprite of innocentSprites) {
            app.stage.removeChild(innocentSprite);
        }
        innocentSprites = [];
        setTimeout(function() {
            playAudio('gameover.mp3');
            alert("Game Over!\nScore: " + _score);
            app.stage.removeChild(wantedSprite);
        }, 2000);
    }
}

function onClick(sender)
{
    if(innocentSprites.length == 0) {
        // Game is paused as the player just found the Wanted critter. Don't do anything
        return;
    }

    if(sender.currentTarget == wantedSprite) {
        // Player clicked the Wanted critter

        // Pause the timer Interval
        clearInterval(timerInterval);

        // Remove all the other critters from the screen
        for(var innocentSprite of innocentSprites) {
            app.stage.removeChild(innocentSprite);
        }
        innocentSprites = [];

        // After a brief pause, increase the score
        setTimeout(function() {
            increaseScore();
        }, 2000);
        setTimeout(function() {
            app.stage.removeChild(wantedSprite);
            app.stage.removeChild(wantedSpriteSign);
            startRound();
        }, 4000);
    } else {
        // Player clicked the wrong Critter
        lowerTime(5);
    }
}



