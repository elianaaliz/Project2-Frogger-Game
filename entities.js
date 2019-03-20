var sprites = {
bg: {sx: 421,sy: 0,w: 423,h: 623,frames: 1}, 
frog: {sx: 80,sy: 343,w: 38,h: 48,frames: 1},
car1: {sx: 8,sy: 4,w: 96,h: 48,frames: 1},
car2: {sx: 109,sy: 4,w: 96,h: 48,frames: 1},
car3: {sx: 213,sy: 4,w: 96,h: 48,frames: 1},
car4: {sx: 7,sy: 62,w: 125,h: 48,frames: 1},
car5: {sx: 148,sy: 62,w: 200,h: 48,frames: 1},
trunk1: {sx: 9,sy: 172,w: 247,h: 42,frames: 1},
trunk2: {sx: 9,sy: 123,w: 191,h: 42,frames: 1},
trunk3: {sx: 270,sy: 172,w: 130,h: 42,frames: 1},
turtle: {sx: 7,sy: 288,w: 46,h: 45,frames: 1},
death: {sx: 211,sy: 128,w: 48,h: 38,frames: 4},
//Galaga
 //ship: { sx: 0, sy: 0, w: 38, h: 43, frames: 3 },
 //missile: { sx: 0, sy: 42, w: 7, h: 20, frames: 1 },
 //enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
 //enemy_bee: { sx: 79, sy: 0, w: 37, h: 43, frames: 1 },
 //enemy_ship: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
 //enemy_circle: { sx: 158, sy: 0, w: 32, h: 33, frames: 1 },
 //explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },

};

var spawnObjects = {
  car1: {sprite: 'car1',row: 1,speed: 100},
  car2: {sprite: 'car2',row: 2,speed: -70},
  car3: {sprite: 'car3',row: 3,speed: -110},
  car4: {sprite: 'car4',row: 4,speed: 200},
  car5: {sprite: 'car5',row: 5,speed: -150},
  trunk1: {sprite: 'trunk1',row: 0,speed: -70},
  trunk2: {sprite: 'trunk2',row: 4,speed: 60},
  trunk3: {sprite: 'trunk3',row: 2,speed: -220},
  turtle: {row: 1,speed: 110},
  turtle2: {row: 3,speed: 110}
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

var Spawner = function(lapse,elem) {
  this.lapse = lapse;
  this.obj = elem;
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

//FROG
var Frog = function() {
  this.setup('frog', {
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
  //Game.lives--;
  if (this.board.remove(this)) {
      this.board.add(new Death(this));
  }

};

Frog.prototype.step = function(dt) {
  //FUNCION AUXILIAR?
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
      } else if (Game.keys['down']) {
          this.reload = this.reloadTime;
          this.y += this.h;
      } else if (Game.keys['right'] && this.x + this.w <= Game.width - this.w) {
          this.reload = this.reloadTime;
          this.x += this.w;
      } else if (Game.keys['left'] && this.x - this.w >= 0) {
          this.reload = this.reloadTime;
          this.x -= this.w;
      }


      if (this.y < 0) this.y = 0;
      else if (this.y > Game.height - this.h) this.y = Game.height - this.h;
      if (this.x < 0) this.x = 0;
      else if (this.x > Game.width - this.w) this.x = Game.width - this.w;
  }
      this.vx = 0;
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
};

//WATER
//mirar lo de las medias
var Water = function() {
  this.y = 48;
  this.x = 0;
  this.w = Game.width;
  this.h = 48 * 4;
  this.zIndex = 0;
};

Water.prototype = new Sprite();
Water.prototype.type = WATER;
Water.prototype.draw = function() {};
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
      if(!this.end){
      loseGame();
      }
      this.end = true;
    }
    
};

//Home

var Home = function() {
  this.x = 0;
  this.y = 0;
  this.w = Game.width;
  this.h = 40;  //intentar que sea 48, como una casilla normal
  this.zIndex = 0;
  this.t = 0;

};
Home.prototype = new Sprite();

Home.prototype.step = function(dt) {
  var col = this.board.collide(this, FROG);
  if (col && col.type === FROG) {
      this.t += dt;
      if (this.t >= 0.5) {  //probar con otros numeros 
        //arreglar lo de la rana
      //mide el tiempo al que tiene que reaccionar el objeto aunque de llegada
          this.board.remove(col);
          winGame();
      }
      
  }

};
Home.prototype.draw = function() {};

