//board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;


//mermaid
let mermaidWidth = 46;
let mermaidHeight= 46;
let mermaidX = boardWidth/2 - mermaidWidth/2;
let mermaidY = boardHeight*7/8 - mermaidHeight;
let mermaidRightImg;
let mermaidLeftImg;


let mermaid = {
    img : null,
    x : mermaidX,
    y : mermaidY,
    width : mermaidWidth,
    height : mermaidHeight
}


//physics
let velocityX = 0;
let velocityY = 0;  
let initialVelocityY = -4; //staring velocity Y = 8
let gravity = 0.4; //orig 0.4


//platforms
let platformArray = [];
let platformWidth = 100;
let platformHeight = 68;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;





window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //draw mermaid
    // context.fillStyle = "blue";
    // context.fillRect(mermaid.x, mermaid.y, mermaid.width, mermaid.height);

    //load images
    mermaidRightImg = new Image();
    mermaidRightImg.src = "./mermaidjumper-right (1).png";
    mermaid.img = mermaidRightImg;
    mermaidRightImg.onload = function() {
        context.drawImage(mermaid.img, mermaid.x, mermaid.y, mermaid.width, mermaid.height);
    }

    mermaidLeftImg = new Image();
    mermaidLeftImg.src = "./mermaidjumper-left (1).png";

    platformImg = new Image();
    platformImg.src = "./platform (1).png";

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveMermaid);

}

function update() {
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);


    //mermaid
    mermaid.x += velocityX;
    if (mermaid.x > boardWidth) {
        mermaid.x = 0;
    }
    else if (mermaid.x + mermaid.width < 0 ){
        mermaid.x = boardWidth;
    }

    velocityY += gravity;
    mermaid.y += velocityY;
    if(mermaid.y > board.height){
        gameOver = true;
    }
    context.drawImage(mermaid.img, mermaid.x, mermaid.y, mermaid.width, mermaid.height);

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && mermaid.y < boardHeight*3/4) {
            platform.y -= initialVelocityY; //slide platforms down
        }
        if (detectCollision(mermaid, platform) && velocityY >= 0){
            velocityY = initialVelocityY; //jump!
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    //clear platforms and add new ones
    while(platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); //removes first element from array
        newPlatform(); //replaces platform
    }

    //score
    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);

    if (gameOver){
        context.fillText("Game Over: Press 'Space' to Restart", boardWidth/7, boardHeight*7/8)
    }

}

function moveMermaid(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        velocityX = 4;
        mermaid.img = mermaidRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        velocityX = -4;
        mermaid.img = mermaidLeftImg;
    }
    else if (e.code == "Space" && gameOver) {
        //reset
        mermaid = {
            img : mermaidRightImg,
            x : mermaidX,
            y : mermaidY,
            width : mermaidWidth,
            height : mermaidHeight
        }
        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();

    }
}

function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }
    platformArray.push(platform);

    // platform = {
    //     img : platformImg,
    //     x : boardWidth/2,
    //     y : boardHeight - 150,
    //     width : platformWidth,
    //     height : platformHeight
    // }
    // platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4;
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
        platformArray.push(platform);
    }

}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4;
        let platform = {
            img : platformImg,
            x : randomX,
            y : -platformHeight,
            width : platformWidth,
            height : platformHeight
        }
        platformArray.push(platform);
}

function detectCollision(a, b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function updateScore() {
    let points = Math.floor(50*Math.random()); 
    if(velocityY < 0){
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0){
        maxScore -= points;
    }
}