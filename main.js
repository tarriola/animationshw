var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y, 900, 600);
};

Background.prototype.update = function () {
};

// function MushroomDude(game, spritesheet) {
//     this.animation = new Animation(spritesheet, 189, 230, 5, 0.10, 14, true, 1);
//     this.x = 0;
//     this.y = 0;
//     this.speed = 100;
//     this.game = game;
//     this.ctx = game.ctx;
// }
//
// MushroomDude.prototype.draw = function () {
//     this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
// }
//
// MushroomDude.prototype.update = function () {
//     if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
//         this.x += this.game.clockTick * this.speed;
//     if (this.x > 800) this.x = -230;
// }


// inheritance
function Megaman(game, spritesheet, x, y, type) {
    // this.animation = new Animation(spritesheet, 512, 256, 2, 0.05, 8, true, 0.5);
    this.teleportIn = new Animation(AM.getAsset("./img/megaman1.png"), 56, 115, 17, 0.10, 17, false, 1.4);
    this.rest = new Animation(AM.getAsset("./img/megaman2.png"), 79, 79, 12, 0.15, 12, false, 1.45);
    this.run = new Animation(AM.getAsset("./img/megaman3.png"), 87, 79, 11, 0.10, 11, true, 1.25);
    this.jump = new Animation(AM.getAsset("./img/megaman4.png"), 73, 93, 13, 0.10, 13, false, 1.25);
    this.teleportOut = new Animation(AM.getAsset("./img/megaman5.png"), 59, 120, 16, 0.10, 16, false, .95);
    this.animation;
    switch (type) {
      case 1:
          this.animation = this.teleportIn;
      break;
      case 2:
          this.animation = this.rest;
      break;
      case 3:
          this.animation = this.run;
      break;
      case 4:
          this.animation = this.jump;
      break;
      case 5:
          this.animation = this.telportOut;
      break;
    }

    this.oldX = 0;
    this.oldY = 400;
    this.jumping = false;
    this.ground = 400;
    this.teleport = true;



    this.speed = 200;
    this.ctx = game.ctx;
    Entity.call(this, game, x, y);
}

Megaman.prototype = new Entity();
Megaman.prototype.constructor = Megaman;

Megaman.prototype.update = function () {
    if (this.teleportIn.isDone()) {
        this.teleport = false;
    }
    if (!this.teleport) {
        this.x += this.game.clockTick * this.speed;
    }
    if (this.x > 850) {
        this.x = 20;
        this.teleport = true;
        this.teleportIn.elapsedTime = 0;
        this.jump.elapsedTime = 0;
    }

    // if (this.x >= 400 && !this.jump.isDone()) {
    //     this.oldY = this.y;
    //     this.y += this.game.clockTick * 10;
    //     this.animation = this.jump;
    //     // this.jump.elapsedTime = 0;
    // } else {
    //     this.animation = this.run;
    // }

    if (this.x >= 350 && this.x <= 360) this.jumping = true;

    if (this.jumping) {
        if (this.jump.isDone()) {
            this.jump.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jump.elapsedTime / this.jump.totalTime;
        var totalHeight = 100;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }


    Entity.prototype.update.call(this);
}

Megaman.prototype.draw = function () {
    // this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    // this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    if (this.jumping) {
        this.jump.drawFrame(this.game.clockTick, this.ctx, this.x + 17, this.y - 34);
    } else if (this.teleport) {
      this.teleportIn.drawFrame(this.game.clockTick, this.ctx, this.x, this.y- 55);
      // this.teleport = false;
    }  else {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);

}

AM.queueDownload("./img/RobotUnicorn.png");
AM.queueDownload("./img/guy.jpg");
AM.queueDownload("./img/mushroomdude.png");
AM.queueDownload("./img/runningcat.png");
AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/grid.jpg");

AM.queueDownload("./img/megaman1.png");
AM.queueDownload("./img/megaman2.png");
AM.queueDownload("./img/megaman3.png");
AM.queueDownload("./img/megaman4.png");
AM.queueDownload("./img/megaman5.png");
AM.queueDownload("./img/citynight.jpg");


AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/citynight.jpg")));
    // gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    gameEngine.addEntity(new Megaman(gameEngine, AM.getAsset("./img/runningcat.png"), 20, 400, 3));
    // gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./img/guy.jpg")));

    console.log("All Done!");
});
