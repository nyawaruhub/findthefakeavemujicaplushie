const app = new PIXI.Application();

const critterFiles = ["uikar.png", "nyamur.png", "mutsumir.png", "umirir.png", "sakikor.png"];
const impostorFiles = ["uikaf.png", "nyamuf.png", "mutsumif.png", "umirif.png", "sakikof.png"];
const audioFiles = ["uika.mp3", "nyamu.mp3", "mutsumi.mp3", "umiri.mp3", "sakiko.mp3"];

var critterTextures = [];
var impostorTextures = [];
var innocentSprites = []
var wantedSprite = undefined;
var wantedSpriteSign = undefined;
var wantedAudio = undefined
var _score = 0;
var _time = 0;
var lblScore = undefined;
var lblTime = undefined;
var divGameOver = undefined;
var divContent = undefined;
var divStart = undefined;
var timerInterval = undefined;
var music = undefined;
var playSounds = true;

document.addEventListener('DOMContentLoaded', function() {
    initGame();
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
    lblScore = document.getElementById("lblScore");
    lblTime = document.getElementById("lblTime");
    divGameOver = document.getElementById("divGameOver");
    divContent = document.getElementById("divContent");
    divStart = document.getElementById("divStart");

    await app.init({ background: '#000000', width: 1280, height: 960 });
    app.canvas.style.display = "block";
    divContent.appendChild(app.canvas);

    var wantedTexture = await PIXI.Assets.load("img/Wanted.png");
    drawSprite(app, wantedTexture, app.screen.width / 2, 150);

    for(var file of critterFiles) {
        critterTextures.push(await PIXI.Assets.load("img/" + file));
    }

    for(var file of impostorFiles) {
        impostorTextures.push(await PIXI.Assets.load("img/" + file));
    }

}

function startGame() {
    divStart.style.display = "none";

    const divContent = document.getElementById("divContent");
    divContent.style.display = "block";

    divGameOver.style.display = "none";

    var playMusic = !document.getElementById("chkDisableMusic").checked;
    if(playMusic) {
        music = new Audio("sound/music.mp3");
        music.volume = 0.1;
        music.addEventListener('ended', function(){
            music.play();
        }, false);
        music.play();
    }
    playSounds = !document.getElementById("chkDisableSounds").checked;


    _time = 10;
    _score = 0;
    lblScore.innerHTML = "Score: " + _score;
    lblTime.innerHTML = "Time: " + _time;
    
    
    startRound();
}

function lowerTime(seconds) {
    if(seconds == undefined) {
        seconds = 1;
        if(_time <= 5) {
            playAudio("clock2.mp3", 0.35);
        } else {
            playAudio("clock.mp3", 0.35);
        }
        
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

    const wantedIndex = getRandomInt(impostorTextures.length);
    const wantedCritterTexture = impostorTextures[wantedIndex];
    wantedAudio = audioFiles[wantedIndex];

    // Draw the Wanted impostor on the Wanted sign
    wantedSpriteSign = drawSprite(app, wantedCritterTexture, 640, 132);

    // Randomly generate a number that'll be used to decide which quirk to apply on this round
    var roundQuirk = getRandomInt(10);

    // Draw the Wanted sprite first so it can be overlapped and be harder to spot
    wantedSprite = drawSingleCritter(app, wantedCritterTexture, roundQuirk, true);

    // Draw all the other sprites
    for(var i = 0; i < crittersNum - 1; i++) {
        innocentSprites.push(drawSingleCritter(app, getRandomItem(critterTextures), roundQuirk));
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
        playAudio(wantedAudio, 0.5);
        setTimeout(function() {
            app.stage.removeChild(wantedSprite);
            app.stage.removeChild(wantedSpriteSign);

            if(music != undefined) music.pause();
            playAudio('gameover.mp3');

            divGameOver.style.display = "block";
            const lblGameOver = document.getElementById("lblGameOver");
            lblGameOver.innerHTML = "Game Over! Score: " + _score;

            divStart.style.display = "block";
        
            const divContent = document.getElementById("divContent");
            divContent.style.display = "none";
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
        playAudio(wantedAudio, 0.5);

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



