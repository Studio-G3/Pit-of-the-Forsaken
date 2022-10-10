var gameRunning = false;
var menuMusic = document.getElementById('menuMusic');
menuMusic.currentTime = 7.2;
var backgroundMusic = document.getElementById('backgroundMusic');
var character = document.getElementById("placeholder");
var healthBar = document.getElementById("healthBar");
character.style.top = "450px";
character.style.left = "800px";
var body = document.body,
    html = document.documentElement;
var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
var width = Math.max( body.scrollWidth, body.offsetWidth, 
                        html.clientWidth, html.scrollWidth, html.offsetWidth );

const charHeight = 69, charWidth = 75
const liveCharacter = document.getElementById("livecharacter");
const enemyDiv = document.getElementById("enemyDiv");
const scoreText = document.getElementById("scoreHolder");
const ampText = document.getElementById("ampHolder");
const timerText = document.getElementById("timerHolder");
const slash = document.getElementById("RPGslash").style;
const slashElem = document.getElementById("RPGslash");
const pauseBtn = document.getElementById("pauseBtn");
const liveHealthBar = document.getElementById("liveHealthBar").style;
const health = document.getElementById("liveHealthBar");
const mainMenu = document.getElementById('mainMenu');
const game = document.getElementById("game");
const gameOverMenu = document.getElementById("gameOverMenu");
const gameOverScore = document.getElementById("playerScore");
const xBound = window.innerWidth;
const yBound = window.innerHeight;

const CHAR_TOP = "450px";
const CHAR_LEFT = "800px";
const SLASH_TRANSFORM = slash.transform;

let spawn = false, spawnLimit = 10;
let modScore = false, score = 0, amp = 1, scoreDisplay = '';
let ms = 0, sec = 0, min = 0;
let map = ("Dungeon");

class Character{
    dy
    dx
    constructor(htmlElement, health, speed){
        this.character = htmlElement;
        this.health = health;
        this.speed = speed;
        this.dx = 0;
        this.dy = 0;
    }

    update(){
        let newY = (parseInt(this.character.style.top.slice(0, -2)) + (this.speed * this.dy))
        let newX = (parseInt(this.character.style.left.slice(0, -2)) + (this.speed * this.dx))

        if (newY < 0 ) newY = 0;
        else if (newY + charHeight > height) newY = height - charHeight;
        
        if (newX < 0) newX = 0;
        else if (newX + charWidth > width) newX = width - charWidth;

        this.character.style.top = newY + "px"
        this.character.style.left = newX + "px"
        handleHealthBar();
    }
} let player = new Character(character, 100, 7);

class Enemy extends Character{
    static curId = 0
    id
    constructor(health, speed, x, y){
        super(null, health, speed)
        this.id = Enemy.curId
        Enemy.curId++
        let enemyId = "enemy"+this.id

        let brightnessVal = ((speed - enemyMinSpeed) / enemyMaxSpeed) * 100 + 55

        enemyDiv.innerHTML += ('<div id='+enemyId+"div"+' class="Character set-pos enemy"><img src="Images/DemoRpgskeleton.png" id='+
            enemyId+' class="Character_spritesheet pixelart face-down" alt="Enemy"></div>')
        document.getElementById(enemyId+"div").style.top = y+"px"
        document.getElementById(enemyId+"div").style.left = x+"px"
        document.getElementById(enemyId+"div").style.filter = "brightness("+brightnessVal+"%)"
        this.character = document.getElementById(enemyId+"div")
    }

    update(playerX,playerY){
        let cha = document.getElementById("enemy"+this.id+"div")

        let theta = Math.atan2(playerY - parseFloat(cha.style.top.replace("px","")), playerX - parseFloat(cha.style.left.replace("px","")))

        let newX = parseFloat(cha.style.left.replace("px","")) + (this.speed * Math.cos(theta))
        let newY = parseFloat(cha.style.top.replace("px","")) + (this.speed * Math.sin(theta))

        cha.style.top = newY +"px"
        cha.style.left = newX + "px"
        this.character = cha;
    }

} let enemies = [], enemyMinSpeed = 3.5, enemyMaxSpeed = 5.5
 
document.onkeydown = function(event){
    if (!gameRunning) return;
    switch(event.keyCode){
        case 87: // W
            player.dy = -1;
            health.dy = -1;
            liveCharacter.className = "Character_spritesheet pixelart face-up";
            break;
        case 83: // S
            player.dy = 1;
            health.dy = 1;
            liveCharacter.className = "Character_spritesheet pixelart face-down";
            break;
        case 65: // A
            player.dx = -1;
            health.dx = -1;
            liveCharacter.className = "Character_spritesheet pixelart face-left";
            break;
        case 68: // D
            player.dx = 1;
            health.dx = 1;
            liveCharacter.className = "Character_spritesheet pixelart face-right";
            break;
        case 32: // Space
            if (!event.repeat) (handleSlash(), handleSlashDelay());
            break;
        case 84: // T
            character.health -= 10;
            health.value -= 10;
            if (character.health == 0) endGame();
            break;
    }
}

document.onkeyup = function(event){
    if (!gameRunning) return;
    switch(event.keyCode){
        case 87: // W
        case 83: // S
            player.dy = 0
            break;
        case 65: // A
        case 68: // D
            player.dx = 0
            break;
        case 32: // Space
            slash.visibility = 'hidden';
            slash.transform = SLASH_TRANSFORM;
            break;
    }    
}

let handleHealthBar = () => {
    if (!gameRunning) return;
    liveHealthBar.top = String(Number(character.style.top.replace("px","")) - 30) + "px";
    liveHealthBar.left = String(Number(character.style.left.replace("px","")) - 8) + "px";
}

let handleSlash = () => {
    if (!gameRunning) return;
    playAudio("audio/slash.wav")
    switch(liveCharacter.className.slice(36)) {
        case 'up':
            slash.transform = "rotate(270deg)";
            slash.top = String(Number(character.style.top.replace("px","")) - 275) + "px";
            slash.left = String(Number(character.style.left.replace("px","")) - 12) + "px";
            break;
        case 'down':
            slash.transform = "rotate(90deg)";
            slash.top = String(Number(character.style.top.replace("px","")) - 25) + "px";
            slash.left = String(Number(character.style.left.replace("px","")) - 50) + "px";
            break;
        case 'left':
            slash.transform = "rotateY(180deg)";
            slash.top = String(Number(character.style.top.replace("px","")) - 115) + "px";
            slash.left = String(Number(character.style.left.replace("px","")) - 120) + "px";
            break;
        case 'right':
            slash.top = String(Number(character.style.top.replace("px","")) - 115) + "px";
            slash.left = String(Number(character.style.left.replace("px","")) + 55) + "px";
            break;
    }

    slash.visibility = 'visible';
}

let handleSlashDelay = async () => {
    await new Promise(res => setTimeout(res, 100));
    slash.visibility = 'hidden';
    slash.transform = SLASH_TRANSFORM;
}

let handleScore = () => {
    scoreDisplay = score < 100 ? '00000' : (score < 1000 ? `00${ score }` : 
        (score < 10000 ? `0${ score }` : `${ score }`));
    scoreText.textContent = `Score: ${ scoreDisplay }`;
    ampText.textContent = `X${ amp }`;
    if (modScore) (score += 100 * amp, modScore = false);
}

let handleTimer = () => {
    ms > 299 ? (sec++, ms=0, spawn=true, modScore=true) : null;
    sec > 59 ? (min++, sec=0, ms=0): null;
    let timerMs = ms < 10 ? `00${ ms }` : (ms < 100 ? `0${ ms }` : `${ ms }`);
    let timerSec = sec < 10 ? `0${ sec }` : `${ sec }`;
    let timerMin = min < 10 ? `0${ min }` : `${ min }`;
    timerText.textContent = `${ timerMin }:${ timerSec }:${ timerMs }`;
}

let getRandomEnemySpeed = () => {
    return Math.random() * (enemyMaxSpeed - enemyMinSpeed) + enemyMinSpeed
}

let handleSpawn = () => {
    if (!(sec > 0 && spawnLimit < 49)) return;
    sec%15 == 0 && spawn ? (spawnLimit+=Math.floor(spawnLimit/2), amp++) : null;
    if (spawnLimit==49) spawnLimit++;
    spawn = false;
    while (enemies.length < spawnLimit) {
        let coords = handleSpawnLocation();
        enemies.push(new Enemy(10, getRandomEnemySpeed(), coords[0], coords[1]));
    }
}

let handleSpawnLocation = () => {
    let x, y;
    let chance = Math.floor(Math.random() * 4);
    switch (chance) {
        case 0: 
            x = Math.random() * xBound;
            y = Math.random() * ((yBound+100) - yBound) + yBound;
            break;
        case 1: 
            x = Math.random() * xBound;
            y = Math.random() * (-100);
            break;
        case 2: 
            x = Math.random() * (xBound+100 - xBound) + xBound;
            y = Math.random() * yBound;
            break
        case 3:
            x = Math.random() * (-100);
            y = Math.random() * yBound;
            break;
    }
    return [Math.floor(x), Math.floor(y)]
}

let endGame = () => {
    healthBar.style.top = CHAR_TOP;
    healthBar.style.left = CHAR_LEFT;
    character.style.top = CHAR_TOP;
    character.style.left = CHAR_LEFT;
    health.value = 100;
    gameRunning = false;
    mainMenu.style.display = "none";
    game.style.display = "none";
    gameOverMenu.style.display = "block";
    gameOverScore.textContent = `YOUR SCORE ${ scoreDisplay }`
    gameRunning = false;
}

setInterval(function updateTimer() {
    if (gameRunning) (ms++, handleTimer());
}, 1);

let checkCollision = (div1, div2) => {
    let r1 = div1.getBoundingClientRect()
    let r2 = div2.getBoundingClientRect()
    return !(pxToVar(r1.right) < pxToVar(r2.left) || 
        pxToVar(r1.left) > pxToVar(r2.right) || 
        pxToVar(r1.bottom) < pxToVar(r2.top) || 
        pxToVar(r1.top) > pxToVar(r2.bottom))
}

function mapCollision(div1,div2) {
    let r1 = div1.getBoundingClientRect()
    let r2 = div2.getBoundingClientRect()
    return !(pxToVar(r1.right) < pxToVar(r2.left) || 
        pxToVar(r1.left) > pxToVar(r2.right) || 
        pxToVar(r1.bottom) < pxToVar(r2.top) || 
        pxToVar(r1.top) > pxToVar(r2.bottom))
}

function pxToVar(pxString){
    return pxString
}

setInterval(function update(){
    if (!gameRunning) return;
    if (document.activeElement === pauseBtn) pauseBtn.blur();
    player.update();
    let playerX = parseInt(player.character.style.left.replace("px",""));
    let playerY = parseInt(player.character.style.top.replace("px","")) + charHeight;
    for(let i=enemies.length - 1; i>=0; i-=1) {
        let enemyDiv = document.getElementById("enemy"+enemies[i].id+"div")
        let characterDiv = document.getElementById("placeholder");
        if (slash.visibility == 'visible' && checkCollision(enemyDiv, slashElem)) {
            enemies[i].speed = 0
            enemyDiv.remove()
            enemies.splice(i,1)
            playAudio("audio/skeleton.wav")
        }else if(checkCollision(enemyDiv, characterDiv)) {
            health.value -= .3;
            if(health.value == 0) endGame();
        }
        else {
            enemies[i].update(playerX, playerY)
        }
    }
    handleSpawn();
    handleScore();
}, 25);

function gameStart(){
    menuMusic.pause();
    menuMusic.currentTime = 0;
    mainMenu.style.display = "none";
    game.style.display = "block";
    gameOverMenu.style.display = "none";
    backgroundMusic.play();
    gameRunning = true;
    spawn = false, spawnLimit = 10;
    modScore = false, score = 0, amp = 1;
    ms = 0, sec = 0, min = 0;
    map = ("Dungeon");
    for(let i=enemies.length - 1; i>=0; i-=1) {
        let enemyDiv = document.getElementById("enemy"+enemies[i].id+"div")
        enemies[i].speed = 0
        enemyDiv.remove()
        enemies.splice(i,1)
    }
}
let pauseGame = () => {
    backgroundMusic.pause();
    gameRunning = false;
}

let resumeGame = () => {
    backgroundMusic.play();
    gameRunning = true;
}

let quitGame = () => {
    document.location.reload();
}

let playAudio = (filePath) => {
    var audio = new Audio(filePath);
    audio.play();
}
