document.addEventListener('DOMContentLoaded', function() {
    initGame();
}, false);

const loadImage = async src => {
    const img = new Image();
    img.src = "img/" + src;
    await img.decode();
    return img;    
}

async function initGame() {
    critters = ["uikap.png", "nyamup.png", "mutsumip.png", "umirip.png", "sakikop.png"];
    
    const canvas = document.getElementById("mainCanvas");
    const width = (canvas.width = window.innerWidth - 50);
    const height = (canvas.height = window.innerHeight - 100);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(0 0 0)";
    ctx.fillRect(0, 0, width, height);

    Promise.all(critters.map(loadImage))
        .then(crittersImg => {
            drawCritters(ctx, crittersImg);
        });

    
}

function drawCritters(ctx, crittersImg) {
    const crittersNum = 100;
    const wantedIndex = getRandomInt(crittersImg.length);
    const wantedImg = document.getElementById("wantedImg");

    wantedImg.src = crittersImg[wantedIndex].src;

    for(var i = 0; i < crittersNum - 1; i++) {
        var critterIndex = wantedIndex;
        while(critterIndex == wantedIndex) {
            critterIndex = getRandomInt(crittersImg.length);
        }
        var critterImg = crittersImg[critterIndex];
        drawSingleCritter(ctx, critterImg);
    }

    drawSingleCritter(ctx, crittersImg[wantedIndex]);
}

function drawSingleCritter(ctx, critterImg) {
    var xCoord = getRandomInt(window.innerWidth - 150);
    var yCoord = getRandomInt(window.innerHeight - 150); 

    ctx.drawImage(critterImg, xCoord, yCoord);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}