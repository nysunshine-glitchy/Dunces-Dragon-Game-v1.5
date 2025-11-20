// free sounds https://pixabay.com/sound-effects/search/8-bit/?pagi=4
//https://editor.p5js.org/tstannard64/sketches/w2HqCzKVr https://editor.p5js.org/tstannard64/sketches/57ki_TE28
//https://editor.p5js.org/davidbouchard/sketches/5PQSc_RXf
//https://editor.p5js.org/davidbouchard/sketches/aBMzUPDmF for p5js collisions and health
//https://editor.p5js.org/GDD140-M_C_Merritt/sketches/Dp0wTkP3p

let state = "title"; //title, level select, game1, game2, question1, gameover

const IMG_OFFSET = 0;     // arrow art points RIGHT
const BULLET_SPEED = 12;
const SPAWN_DIST = 28;
const SHOOT_COOLDOWN = 140; // ms between shots
let lastShotMs = 0;

//enemies

let goblins = [];
let goblinAni;
let newGoblinCounter = 0;

//let slimes;
//let slimeani;

//game1 variables
let player;
let bullets = [];
let playerAni;

let playerIdle = [];
let playerMove = [];
let moveAni, idleAni;
let timer = 30;
let highScore = 0;
let lastshotpos;
var score = 0;

//game2/collectgame variables
let bubbles = [];
let bubbleCount;
let startTime;
let finalTime = 0;
let gameOver = false;
let gameState;
var timescore = 0;
let coins;

//backgrounds, font, music, etc
let isPlaying = false;
let titlebg;
let titlebgm;
let myfont;
let goodsound;
let levelselectbg;
let sparkle;
let floorbg;
let levelstartbgm;
let shootbgm;
let shootsound;
let questionbgm;
let treasuresound;
let gameoverbg;
let victorybg;
let coingetsound;
let gobdeath;
let playerouch;

//borders to keep sprites in frame
let floor;
let wall1;
let wall2;
let ceiling;

let gobsbg;
let victorysound;
let arrowimg;
let failuresound;
let healthhud;
////////////////////////////////////////////////////////////////////////////

function preload() {
  titlebg = loadImage("assets/backgrounds/titlescreen.gif");
  treasuresound = loadSound("assets/music/treasure.wav");
  victorybg = loadImage("assets/backgrounds/dragon.gif");
  sparkle = loadImage("assets/images/navy.gif");
  myfont = loadFont("assets/DungeonFont.ttf");
  titlebgm = loadSound("assets/music/titlebgm.wav");
  goodsound = loadSound("assets/music/goodsound.wav");
  levelselectbg = loadImage("assets/backgrounds/levelselect.gif");
  floorbg = loadImage("assets/backgrounds/tile.PNG");
  levelstartbgm = loadSound("assets/music/levelstart.wav");
  shootsound = loadSound("assets/music/shootsound.mp3");
  shootbgm = loadSound("assets/music/shootbg.wav");
  gobsbg = loadImage("assets/backgrounds/gobs.gif");
  questionbgm = loadSound("assets/music/bitty-boss-54953.mp3");
  gameoverbg = loadImage("assets/backgrounds/end.gif");
  victorysound = loadSound("assets/music/victory.wav");
  arrowimg = loadImage("assets/images/Arrow.png");
  failuresound = loadSound("assets/music/failure.wav");
  healthhud = loadImage("assets/images/health_ui.png");
  coingetsound = loadSound("assets/music/retro-coin-3-236679.mp3");
  coins = loadImage("assets/images/coin.gif");
  gobdeath = loadSound("assets/music/little-creature-hurt-sound-295405.mp3");
  playerouch = loadSound("assets/music/homemadeoof-47509.mp3");

  goblinAni = loadAnimation(
    "assets/enemies/goblin_run_anim_f0.png",
    "assets/enemies/goblin_run_anim_f1.png",
    "assets/enemies/goblin_run_anim_f2.png",
    "assets/enemies/goblin_run_anim_f3.png",
    "assets/enemies/goblin_run_anim_f4.png",
    "assets/enemies/goblin_run_anim_f5.png"
  );

  
 
}

////////////////////////////////////////////////////////////////////////////

function setup() {
  let canvas = createCanvas(800, 800);
  canvas.parent("gameCanvas"); // div id from HTML

  outputVolume(0.2);
  //allSprites.debug = true;

  //player and animations
   player = new Sprite(400, 400, 10);
  player.health = 10;
  player.w = 10;
  player.h = 10;
  player.scale = 3;
  player.collider = "dynamic";
  player.rotationLock = true;  // don't let physics rotate the sprite
  //player.rotation = 0;
player.bounciness = 0;       // no ping-pong off walls
player.friction = 0;         // slide along walls nicely
player.drag = 0.12;          // gentle easing when you release keys

bullets = new Group();
bullets.x = () => player.x;   // only used at creation time
bullets.y = () => player.y;
bullets.image = arrowimg;
bullets.collider = "kinematic";
bullets.overlaps(player);
bullets.rotationLock = true;  // fine for kinematic; prevents physics spin
bullets.speed = 10;           // default, can override per bullet
bullets.life = 200;
bullets.scale = 2;



  goblins = new Group();
  goblins.addAni(goblinAni);
  goblins.w = 20;
  goblins.h = 20;
  goblins.x = () => random(width);
  goblins.y = () => random(height);
 
  //goblins.direction = () => player.x;
  goblins.speed = () => random(2, 6);
  goblins.health = 1;
  goblins.collider = "dynamic";
  //goblins.overlaps(goblins); // turns off collision between goblins, optional
  goblins.collides(bullets, goblinHit);
  goblins.collides(player, playerHit);

  goblins.scale = 3;

  player.addAni(
    "idle",
    "assets/player/Hobbit - Idle0.png",
    "assets/player/Hobbit - Idle1.png",
    "assets/player/Hobbit - Idle2.png",
    "assets/player/Hobbit - Idle3.png"
  );

  player.addAni(
    "move",
    "assets/player/Hobbit - run1.png",
    "assets/player/Hobbit - run2.png",
    "assets/player/Hobbit - run3.png",
    "assets/player/Hobbit - run4.png",
    "assets/player/Hobbit - run5.png",
    "assets/player/Hobbit - run6.png",
    "assets/player/Hobbit - run7.png",
    "assets/player/Hobbit - run8.png",
    "assets/player/Hobbit - run9.png",
    "assets/player/Hobbit - run10.png"
  );

  player.addAni(
    "attack",
    "assets/player/Hobbit - attack1.png",
    "assets/player/Hobbit - attack2.png",
    "assets/player/Hobbit - attack3.png",
    "assets/player/Hobbit - attack4.png",
    "assets/player/Hobbit - attack5.png",
    "assets/player/Hobbit - attack6.png",
    "assets/player/Hobbit - attack7.png",
    "assets/player/Hobbit - attack8.png",
    "assets/player/Hobbit - attack9.png",
    "assets/player/Hobbit - attack10.png",
    "assets/player/Hobbit - attack11.png",
    "assets/player/Hobbit - attack12.png",
    "assets/player/Hobbit - attack13.png",
    "assets/player/Hobbit - attack14.png",
    "assets/player/Hobbit - attack15.png",
    "assets/player/Hobbit - attack16.png",
    "assets/player/Hobbit - attack17.png"
  );

  player.addAni(
    "hit",
    "assets/player/Hobbit - hit1.png",
    "assets/player/Hobbit - hit2.png",
    "assets/player/Hobbit - hit3.png",
    "assets/player/Hobbit - hit4.png"
  );

  

  ceiling = new Sprite(width/2,   5,   1600, 15, "static");
  ceiling.color = "black";
  ceiling.stroke = 0;

  floor = new Sprite(width/2, 795,   1600, 15, "static");
  floor.color = "black";
  floor.stroke = 0;

  wall1 =new Sprite(0, height/2, 15, 1600, "static");
  wall1.color = "black";
  wall1.stroke = 0;
  wall2 = new Sprite(795,     height/2, 15, 1600, "static");
  wall2.color = "black";
  wall2.stroke = 0;

}

////////////////////////////////////////////////////////////////////////////
//try setting a call for resets in draw functions??
function draw() {
  if (state == "title") {
    title();
  } else if (state == "levelselect") {
    levelselect();
  } else if (state == "game1") {
    game1();
  } else if (state == "game2") {
    game2();
  } else if (state == "question1") {
    question1();
  } else if (state == "gameover") {
    gameover();
  } else if (state == "victory") {
    victory();
  }
 
}


function turnTowardDeg(currentDeg, targetDeg, maxTurnDeg) {
  // shortest wrapped difference in degrees [-180, 180]
  let diff = ((((targetDeg - currentDeg) % 360) + 540) % 360) - 180;
  diff = constrain(diff, -maxTurnDeg, maxTurnDeg);
  return currentDeg + diff;
}

////////////////////////////////////////////////////////////////////////

function title() {
  background(titlebg);
  if (!titlebgm.isPlaying()) {
    titlebgm.play();
  }
  questionbgm.stop();
  shootbgm.stop();
  victorysound.stop();
  allSprites.visible = false;

  textFont(myfont);
  textSize(120);
  fill(205);
  stroke(255, 223, 0);
  strokeWeight(1);
  text("Dunces \n& Dragons", width / 2 - 180, height / 2 - 40);

  //fill(124, 166, 177),
  //rect(300,570, 230, 45 )
  fill(255);
  textSize(55);
  text("Press Start", 300, 620);

  if (mouse.presses()) {
    cursor("assets/images/Hit.png");
  } else {
    cursor("assets/images/Interact.png");
  }

  if (
    mouseX >= 300 &&
    mouseX <= 530 &&
    mouseY >= 500 &&
    mouseY <= 600 &&
    mouseIsPressed == true
  ) {
    state = "levelselect";
    goodsound.play();
  }
}

////////////////////////////////////////////////////////////////////////

function levelselect() {
  /////\\\\\ map state \\\\\/////
  background(levelselectbg);
  shootbgm.stop();
  if (!titlebgm.isPlaying()) {
    titlebgm.play();
  }

  allSprites.visible = false;

  textFont(myfont);
  textSize(80);
  fill(205);
  text("dungeon floors", width / 2 - 190, height / 2 - 270);
  stroke(255, 223, 0);
  strokeWeight(1);
  //rect(70, 200, 100, 150, 10);
  image(sparkle, 30, 200);
  textSize(40);
  text("Stage One", 60, 180);

  image(sparkle, 400, 250);
  textSize(40);
  text("Stage Two", 400, 180);

  if (mouse.presses()) {
    cursor("assets/images/Hit.png");
  } else {
    cursor("assets/images/Interact.png");
  }

  if (
    state == "levelselect" &&
    mouseX >= 60 &&
    mouseX <= 220 &&
    mouseY >= 135 &&
    mouseY <= 285 &&
    mouse.presses()
  ) {
    state = "game1";
    goodsound.play();
    titlebgm.stop();
    timer = 30;
  }

  if (
    state == "levelselect" &&
    mouseX >= 400 &&
    mouseX <= 520 &&
    mouseY >= 250 &&
    mouseY <= 385 &&
    mouse.presses()
  ) {
    state = "game2";
    goodsound.play();
    titlebgm.stop();
    startTime = millis();
    bubbleCount = int(random(10, 50)); // Random count from 10 to 25

    for (let i = 0; i < bubbleCount; i++) {
      let x = random(width);
      let y = random(height);
      let r = random(20, 40);
      bubbles.push(new Bubble(x, y, r));
    }
  }
}

let _enteredGame1 = false;
////////////////////////////////////////////////////////////////////////

function game1() {
  background(floorbg);
 

  if (!shootbgm.isPlaying()) {
    shootbgm.play();
  }
  titlebgm.stop();
  questionbgm.stop();
  GUI();

   if (!_enteredGame1) {
    goblins.removeAll();
    goblins.amount = 5;
    _enteredGame1 = true;
  }
  image(healthhud, 20, 20, 200, 20);
  allSprites.visible = true;

  textFont(myfont);
  textSize(50);
  fill(255);
  stroke(255, 223, 0);
  strokeWeight(1);
  text(" Avoid the Goblins to survive", 150, 70);

  text(timer, 400, 180); //https://editor.p5js.org/marynotari/sketches/S1T2ZTMp-
  textSize(30);
  text("Score: " + score, 20, 150);
  if (frameCount % 60 == 0 && timer > 0) {
    // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timer--;
  }
  if (timer == 0 && state === "game1") {
    state = "question1";
     _enteredGame1 = false;
  }

 
// SHOOT on click: create one bullet and aim toward the mouse at that moment
if (mouse.presses() && millis() - lastShotMs >= SHOOT_COOLDOWN) {
  lastShotMs = millis();
  cursor('crosshair');
  shootsound.play();

  const angDeg = degrees(atan2(mouseY - player.y, mouseX - player.x));
  const angRad = radians(angDeg);

  const b = new bullets.Sprite();
  b.x = player.x + cos(angRad) * SPAWN_DIST;
  b.y = player.y + sin(angRad) * SPAWN_DIST;
  b.direction = angDeg;   // travel path
  b.rotation  = angDeg + IMG_OFFSET; // matches your image
  b.speed = BULLET_SPEED;
  b.life  = 200;
}


// add gobs every 90 frames
  newGoblinCounter++;
  if (newGoblinCounter > 90) {
    newGoblinCounter = 0;
    let newGob = new goblins.Sprite();
    // prevent new goblins from spawning on top of the player!
    while (dist(newGob.x, newGob.y, player.x, player.y) < 100) {
      newGob.remove();
      newGob = new goblins.Sprite();
    }
  }

  // goblins
  for (let g of goblins) {
    // face the correct way!
    if (g.vel.x > 0) g.scale.x = 3;
    if (g.vel.x < 0) g.scale.x = -3;
    g.moveTowards(player, 0.01);

    // wrap around the edges of the screen
    if (g.x < -100) g.x = width + 100;
    if (g.x > width + 100) g.x = -100;
    if (g.y < -100) g.y = height + 100;
    if (g.y > height + 100) g.y = -100;

    // random direction change
    if (random(1) < 0.01) {
      g.vel.x = random(-2, 2);
      g.vel.y = random(-2, 2);
    }
 
// --- INPUT: WASD/arrow keys -> a single velocity ---
if (keyIsPressed === true && state === "game1") {
      if (kb.pressing("up")) {
        player.ani = "move";
        //  player.vel.x = 0;
        player.vel.y = -3;
        //player.bearing = player.rotation + 10;
      }
      if (kb.pressing("right")) {
        player.ani = "move";
        player.vel.x = 3;
        //player.vel.y = 0;
        
      }
      if (kb.pressing("down")) {
        player.ani = "move";
        //player.vel.x = 0;
        player.vel.y = 3;
      }
      if (kb.pressing("left")) {
        player.ani = "move";
        player.vel.x = -3;
        //player.vel.y = 0;a
    
      }
    } else {
      player.ani = "idle";
      player.vel.x = 0;
      player.vel.y = 0;
    }

    if (mouseIsPressed === true && state === "game1") {
      player.changeAni("attack");
    }
    if (pmouseX > mouseX) player.scale.x = -3;
    if (pmouseX < mouseX) player.scale.x = 3;

    // draw the player's health bar
    let healthWidth = map(player.health, 0, 10, 0, 200);
    //add health hud later as an image overlapping this
    fill("red");
    rect(20, 20, healthWidth, 20);
    stroke("white");
    noFill();
    rect(20, 20, 200, 20);
    noStroke();
  }

  if (kb.presses("ESCAPE")) {
    state = "title";
    goodsound.play();
    reset();
  }
}

//////////////////////////////////////////////////////////////////////////////////////
function GUI() {
  fill(255);
  textSize(30);
  textAlign(LEFT);
  stroke(2);
     text(
    "wasd to Move press esc to return to menu, left click to shoot",
    (width / 2) * 0.15,
    height - 40);
}

///////////////////////////////////////////////////////////////

function goblinHit(goblin, bullet) {
  goblin.health--; // take off one health
  goblin.vel.x -= 15;
  goblin.vel.y -= 10;
  let h = map(goblin.health, 0, 5, 0.2, 1);
  

  bullet.remove(); //remove bullet you hit with

  if (goblin.health <= 0) {
goblin.remove();
  gobdeath.play();
  score += 1;
// if that was the last goblin, we win!
  if (goblins.length == 0) {
    state = "victory";
      _enteredGame1 = false;
    if (kb.presses("ESC")) {
      state = "title";
      goodsound.play();
      player.health = 10;
      goblins.removeAll();
     
    }
  }
  
  
    
  }
}

////////////////////////////////////////////////////////////
function playerHit(goblin, player) {
  player.changeAni("hit");
  playerouch.play();
  player.vel.x -= 10;
  player.vel.y -= 5;

  if (player.health > 0) player.health--;
  else state = "gameover";
  // right after you change to gameover:
_enteredGame1 = false;

  if (kb.presses("ESC")) {
    state = "title";
    goodsound.play();
    player.health = 10;
    goblins.removeAll();
    _enteredGame1 = false;
  }
}

////////////////////////////////////////////////////////////////////////

function game2() {
  background(floorbg);
  if (!shootbgm.isPlaying()) {
    shootbgm.play();
  }

  allSprites.visible = true;


  //player controls
  player.moveTowards(mouse, 1);
  // set the player orientation
  if (pmouseX > mouseX) player.scale.x = -3;
  if (pmouseX < mouseX) player.scale.x = 3;
  player.ani = "move";

  noCursor();
  // Show current time
  fill(255);
  textSize(40);
  stroke(2);
  text("Time: " + ((millis() - startTime) / 1000).toFixed(2) + "s", 60, 120);
  text(" Collect the Coins as fast as you can!", 150, 70);
  textSize(30)
    text(
    "use your mouse to move,  press esc to return to menu",
    (width / 2) * 0.15, height - 40
  );
    

  if (kb.presses("ESCAPE")) {
    state = "title";
    goodsound.play();
  }

  if (!gameOver) {
    for (let i = bubbles.length - 1; i >= 0; i--) {
      let b = bubbles[i];
      b.show();
      b.move();

      if (b.rollover(mouseX, mouseY)) {
        bubbles.splice(i, 1);
        coingetsound.play();
      }
    }
    // Check if all bubbles are popped
    if (bubbles.length === 0) {
      finalTime = (millis() - startTime) / 1000;
      gameOver = true;
      victorysound.play();
      shootbgm.stop();
    }
  } else {
    // Game over screen with message
    background(gameoverbg);
    player.show = false;
    shootbgm.stop();
    player.visible = false;
    textSize(60);
    text("All coins collected!", width / 2 - 200, height / 2 - 40);
    textSize(40);
    text(
      "Final Time: " + finalTime.toFixed(2) + " seconds",
      width / 2 - 200,
      height / 2 + 40
    );
    textSize(35);
    fill(255);
    stroke(2);
    text(
      "Try for a better timescore next time",
      width / 2 - 190,
      height / 2 + 80
    );
    text("press ESC to return to menu", width / 2 - 200, height / 2 + 140);
    //need to align text without it affecting the other functions or states

    if (kb.presses("ESCAPE")) {
      state = "title";
      goodsound.play();
      gameOver = false;
    }
  }
}

class Bubble {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.brightness = 0;
  }

  rollover(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.r + 10;
  }

  move() {
    this.x = constrain(this.x + random(-2, 2), this.r, width - this.r);
    this.y = constrain(this.y + random(-2, 2), this.r, height - this.r);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(100, 150, 255, 150);
    image(coins, this.x, this.y, this.r * 2);
  }
}

////////////////////////////////////////////////////////////////////////

function question1() {
  background(gobsbg);
  shootbgm.stop();
  if (!questionbgm.isPlaying()) {
    questionbgm.play();
  }
  allSprites.visible = false;
  goblins.removeAll();
  shootsound.stop();

  if (mouse.presses()) {
    cursor("assets/images/Hit.png");
    shootsound.play();
  } else {
    cursor("assets/images/Interact.png");
  }

  textFont(myfont);
  fill(255);
  stroke(255, 223, 0);
  strokeWeight(1);

  textSize(35);

  stroke(0);
  fill(234, 221, 202);
  strokeWeight(3);
  rectMode(CORNER);
  rect(30, 120, 730, 200, 7); //big question box
  rect(70, 340, 200, 100, 10); //wrong get game over
  rect(290, 340, 200, 100, 10); //right, go back to game
  rect(510, 340, 200, 100, 10); //wrong get game over

  //words for boxes
  text("you've been jumped! quick! answer their question", 60, 100);
  text(
    "Bwahaha we got you now! Unless you can guess our \n favorite meal? We might let you live...",
    60,
    210
  );
  textSize(45);
  text("dogs?", 120, 410); //wrong
  text("humans?", 310, 410); //right, go back to game
  text("snails?", 550, 410); //wrong

  if (
    state == "question1" &&
    mouseX >= 70 &&
    mouseX <= 270 &&
    mouseY >= 340 &&
    mouseY <= 440 &&
    mouseIsPressed
  ) {
    state = "gameover";
    failuresound.play();
  } else if (
    state == "question1" &&
    mouseX >= 290 &&
    mouseX <= 490 &&
    mouseY >= 340 &&
    mouseY <= 440 &&
    mouseIsPressed
  ) {
    state = "game1";
    treasuresound.play();
    timer = 30;
    goblins.removeAll();
  } else if (
    state == "question1" &&
    mouseX >= 510 &&
    mouseX <= 710 &&
    mouseY >= 340 &&
    mouseY <= 440 &&
    mouseIsPressed
  ) {
    state = "gameover";
    failuresound.play();
  }
}
////////////////////////////////////////////////////////////////////////

function gameover() {
  background(gameoverbg);
  if (!titlebgm.isPlaying()) {
    titlebgm.play();
  }
  shootbgm.stop();
  allSprites.visible = false;
  questionbgm.stop();
  if (mouse.presses()) {
    cursor("assets/images/Hit.png");
  } else {
    cursor("assets/images/Interact.png");
  }

  textFont(myfont);
  textSize(80);
  fill(255);
  stroke(255, 223, 0);
  strokeWeight(1);
  text("GAME OVER!!!", 200, height / 2 - 100);

  textSize(72);

  textSize(40);

  text("Press esc to try again", 270, height / 2);
  text("Goblins Slain:   " + score, 320, height / 2 + 100);

  if (kb.presses("ESCAPE")) {
    state = "title";
    goodsound.play();
    player.health = 10;
    goblins.removeAll();
    goblins.amount = 0;
    reset();
  }
}
////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
function victory() {
  background(victorybg);
  allSprites.visible = false;
  if (!titlebgm.isPlaying()) {
    titlebgm.play();
  }
  shootbgm.stop();
push();
  textAlign(CENTER);
  textSize(40);
  stroke("black");
  fill("white");
  text(" Good job! But more adventures await...", width / 2, height / 2 - 50);
  text("Press 'esc' to try again!", width / 2, height / 2 + 50);
  pop();

  if (state == "victory" && kb.presses("ESCAPE")) {
    state = "title";
    
    goodsound.play();
    player.health = 10;
    goblins.removeAll();
    reset();
  }
}

////////////////////////////////////////////////////////////////////////////

function reset() {
  timescore = 0;
  score = 0;
  gameOver = false;
  //clear();
  allSprites.visible = false;
  state = "title";
  timer = 30;
  player.health = 10;
  goblins.removeAll();
} //maybe remove?


