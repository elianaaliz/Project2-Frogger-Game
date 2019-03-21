var sprites = {
game: {sx: 8, sy: 395, w: 411, h: 161, frames: 1},
bg: {sx: 421,sy: 0,w: 423,h: 623,frames: 1}, 
frog: {sx: -1,sy: 339,w: 40,h: 48,frames: 7},
car1: {sx: 8,sy: 4,w: 96,h: 48,frames: 1},
car2: {sx: 109,sy: 4,w: 96,h: 48,frames: 1},
car3: {sx: 213,sy: 4,w: 96,h: 48,frames: 1},
car4: {sx: 7,sy: 62,w: 125,h: 48,frames: 1}, 
car5: {sx: 148,sy: 62,w: 200,h: 48,frames: 1},
trunk1: {sx: 9,sy: 172,w: 247,h: 42,frames: 1},
trunk2: {sx: 9,sy: 123,w: 191,h: 42,frames: 1},
trunk3: {sx: 270,sy: 172,w: 130,h: 42,frames: 1},
turtle: {sx: 5, sy: 288, w: 51, h: 45, frames: 5},
death: {sx: 211,sy: 128,w: 48,h: 38,frames: 4},

};

var spawnObjects = {
  car1: {sprite: 'car1',row: 1,speed: 200},
  car2: {sprite: 'car2',row: 2,speed: -120},
  car3: {sprite: 'car3',row: 3,speed: -130},
  car4: {sprite: 'car4',row: 4,speed: 100},
  car5: {sprite: 'car5',row: 5,speed: -200},
  trunk1: {sprite: 'trunk1',row: 0,speed: -130},
  trunk2: {sprite: 'trunk2',row: 4,speed: 150},
  trunk3: {sprite: 'trunk3',row: 2,speed: -110},
  turtle: {row: 1,speed: 70},
  turtle2: {row: 3,speed: 70}
};

var FROG = 1,
    CAR = 2,
    TRUNK = 4,
    TURTLE = 8,
    WATER = 16;


/// CLASE PADRE SPRITE
var Sprite = function()  
 { }

Sprite.prototype.setup = function(sprite,props) {
  this.sprite = sprite;
  this.merge(props);
  this.frame = this.frame || 0;
  this.w =  SpriteSheet.map[sprite].w;
  this.h =  SpriteSheet.map[sprite].h;
}

Sprite.prototype.merge = function(props) {
  if(props) {
    for (var prop in props) {
      this[prop] = props[prop];
    }
  }
}
Sprite.prototype.draw = function(ctx) {
  SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
}

Sprite.prototype.hit = function(damage) {
  this.board.remove(this);
}

var Background = function() {
  this.setup('bg', {
      zIndex: 0
  });
  this.x = 0;
  this.y = 0;
};

Background.prototype = new Sprite();
Background.prototype.step = function(dt) {};

var TitleFrogger = function() {
  this.setup('game');

  this.x = Game.width/2 - this.w/3;
  this.y = Game.height/2 - this.h + 40;
};
TitleFrogger.prototype = new Sprite();
TitleFrogger.prototype.step = function(dt){  }


var Spawner = function(objt) {
  this.lapse = objt[0];
  this.obj = objt[1];
  this.zIndex = 0;
  this.t = 0;
}

Spawner.prototype = new Sprite();
Spawner.prototype.draw = function() {};
Spawner.prototype.step = function(dt) {
  this.t += dt;
  if (this.t >= this.lapse) {
      this.board.add(Object.create(this.obj));
      this.t -= this.lapse;
  }
};

var LevelFrogger = function(levelData) {
  this.levelData = levelData;
  this.it = 0;
};

LevelFrogger.prototype = new Sprite();
LevelFrogger.prototype.draw = function() {};
LevelFrogger.prototype.step = function(dt) {
  if (this.it == 0) {
      for (var i = 0; i < this.levelData.length; i++) {
          this.board.add(new Spawner(this.levelData[i]));
      }
      this.it++;
  }
};


//FROG
var Frog = function() {
  this.setup('frog', {
      frame: 0,
      reloadTime: 0.20,
      vx: 0,
      zIndex: 4
  });
  this.CENTER_POINT = {
      x: (Game.width / 2 - this.w / 2),
      y: Game.height - this.h
  };
  this.reload = this.reloadTime;
  this.x = this.CENTER_POINT.x;
  this.y = this.CENTER_POINT.y;
  this.lifes = Game.lives;
  this.jumping = 0;
  this.subFrame = 0;
  this.angle = 0;
}

Frog.prototype = new Sprite();
Frog.prototype.type = FROG;
Frog.prototype.onTrunk = function(vt) {
  this.vx = vt;
};
Frog.prototype.onTurtle = function(vt) {
  this.vx = vt;
};


Frog.prototype.hit = function() {
  Game.lives--;
  if (this.board.remove(this)) {
      this.board.add(new Death(this));
  }

};

//Rotacion de la rana
Frog.prototype.draw = function(ctx) {

  var s = SpriteSheet.map[this.sprite];

  if(!this.frame) this.frame = 0;

  rotation = this.angle * Math.PI / 180;
  ctx.save();
  ctx.translate(this.x + s.w / 2, this.y + s.h / 2);
  ctx.rotate(rotation);
  ctx.drawImage(SpriteSheet.image, s.sx + this.frame * s.w, s.sy, s.w, s.h,-s.w / 2, -s.h / 2, s.w, s.h);
  ctx.restore();

};

Frog.prototype.step = function(dt) {

  if (this.board.collide(this, WATER) && 
      !this.board.collide(this, TRUNK) && 
        !this.board.collide(this, TURTLE)) {
      this.hit();
  }

  this.reload -= dt;
  if (this.reload <= 0) {
      // Movimiento por el tronco
      this.x += this.vx * dt;

      if (Game.keys['up']) {
          this.reload = this.reloadTime;
          this.y -= this.h;
          this.jumping = 1;
          this.angle = 0;
      } else if (Game.keys['down']) {
          this.reload = this.reloadTime;
          this.y += this.h;
          this.jumping = 1;
          this.angle = 180;
      } else if (Game.keys['right'] && this.x + this.w <= Game.width - this.w) {
          this.reload = this.reloadTime;
          this.x += this.w;
          this.jumping = 1;
          this.angle = 90;
      } else if (Game.keys['left'] && this.x - this.w >= 0) {
          this.reload = this.reloadTime;
          this.x -= this.w;
          this.jumping = 1;
          this.angle = 270;
      }


      if (this.y < 0) this.y = 0;
      else if (this.y > Game.height - this.h) this.y = Game.height - this.h;
      if (this.x < 0) this.x = 0;
      else if (this.x > Game.width - this.w) this.x = Game.width - this.w;
  }
      this.vx = 0;

      if(this.jumping === 1) {
        this.frame = Math.floor(this.subFrame++);
        if(this.subFrame > 6) {
          this.subFrame = 0;
          this.jumping = 0;
        }
      } 
};

//Car

var Car = function(sprite, row, speed) {
  this.setup(sprite, {
      zIndex: 5
  });
  this.xVel = speed;
  this.x = (speed > 0) ? 0 : Game.width;

  this.y = Game.height - 48 - (row * 48);
};
Car.prototype = new Sprite();
Car.prototype.type = CAR;

Car.prototype.step = function(dt) {
  this.x += this.xVel * dt;
  if (this.x + this.width < 0 || this.x > Game.width)
      this.board.remove(this);

  var collision = this.board.collide(this, FROG);
  if (collision) {
      collision.hit();
      this.board.remove(this);
  }
};

//TRUNK

var Trunk = function(sprite, row, speed) { 
  
  this.setup(sprite, {zIndex: 1});
  this.xVel = speed;
  this.x = (speed > 0) ? 0 : Game.width;
  this.y = 48 + row * 48 + 5;
};

Trunk.prototype = new Sprite();
Trunk.prototype.type = TRUNK;
Trunk.prototype.step = function(dt) {
  this.x += this.xVel * dt;
  if (this.x + this.width < 0 || this.x > Game.width)
      this.board.remove(this);

  var frog = this.board.collide(this, FROG);
  if (frog){
      frog.onTrunk(this.xVel);
  }
};

//Turtle
var Turtle = function(row, speed) {

  this.setup('turtle', {
      frame: 0,
      subFrame: 0,
      zIndex: 1
  });
  this.xVel = speed;
  this.x = (speed > 0) ? 0 : Game.width;
  this.y = 48 + row * 48;
};

Turtle.prototype = new Sprite();
Turtle.prototype.type = TURTLE;
Turtle.prototype.step = function(dt) {
  this.x += this.xVel * dt;

      if (this.x + this.width < 0 || this.x > Game.width)
          this.board.remove(this);

      var frog = this.board.collide(this, FROG);
      if (frog){
          frog.onTurtle(this.xVel);
      }

    this.frame = Math.floor(this.subFrame++ / 8);
     if(this.subFrame > 36) {
        this.subFrame = 0;
     }
};

//WATER
var Water = function() {
  this.y = 48;
  this.x = 0;
  this.w = Game.width;
  this.h = 48 * 4;
  this.zIndex = 0;
};

Water.prototype = new Sprite();
Water.prototype.type = WATER;
Water.prototype.draw = function() {}; //No se dibuja nada es invisible
Water.prototype.step = function(dt) {};

//Death

var Death = function(frog) {
  this.setup('death', {
      frame: 0,
      f: 0,
      zIndex: 5
  });
  this.frog = frog;
  this.x = frog.x;
  this.y = frog.y;
  this.end = false;
};

Death.prototype = new Sprite();
Death.prototype.step = function(dt) {
  this.f += dt;
  
    if (this.f > 1/4) {
        this.f -= 1/4;
        this.frame++;
    }
    if(this.frame >= 4) {
      this.board.remove(this);
      if (!this.end)
            if (Game.lives <= 0) {
                loseGame();
            } else {
                this.board.add(new Frog()); //hasta que gaste sus 3 vidas
            }
        this.end = true;
    }
    
};

//Home

var Home = function() {
  this.x = 0;
  this.y = 0;
  this.w = Game.width;
  this.h = 40;  
  this.zIndex = 0;
  this.t = 0;

};
Home.prototype = new Sprite();

Home.prototype.step = function(dt) {
  var col = this.board.collide(this, FROG);
  if (col && col.type === FROG) {
      this.t += dt;
      if (this.t >= 0.15) { 
          this.board.remove(col);
          winGame();
      }
      
  }

};
Home.prototype.draw = function() {};

