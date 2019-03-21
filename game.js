


// Especifica lo que se debe pintar al cargar el juego
var startGame = function() {
  Game.setBoard(0,new TitleFrogger());
  Game.setBoard(1,new TitleScreen("",
                                  "Press fire to start playing",
                                  playGame));
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

var playGame = function() {
  Game.lives = 3;
  var boardBg = new GameBoard();
  boardBg.add(new Background());
  Game.setBoard(0, boardBg);
  var gameBoard = new GameBoard();
  
  gameBoard.add(new Spawner(5.5,new Car(spawnObjects.car1.sprite, spawnObjects.car1.row, spawnObjects.car1.speed)));
  gameBoard.add(new Spawner(4.5,new Car(spawnObjects.car2.sprite, spawnObjects.car2.row, spawnObjects.car2.speed)));
  gameBoard.add(new Spawner(5,new Car(spawnObjects.car3.sprite, spawnObjects.car3.row, spawnObjects.car3.speed)));
  gameBoard.add(new Spawner(3,new Car(spawnObjects.car4.sprite, spawnObjects.car4.row, spawnObjects.car4.speed)));
  gameBoard.add(new Spawner(4,new Car(spawnObjects.car5.sprite, spawnObjects.car5.row,spawnObjects.car5.speed)));
  //gameBoard.add(new Turtle(3,-200));
  gameBoard.add(new Spawner(5.5,new Trunk(spawnObjects.trunk1.sprite,spawnObjects.trunk1.row, spawnObjects.trunk1.speed)));
  gameBoard.add(new Spawner(4.5,new Trunk(spawnObjects.trunk2.sprite,spawnObjects.trunk2.row, spawnObjects.trunk2.speed)));
  gameBoard.add(new Spawner(5,new Trunk(spawnObjects.trunk3.sprite,spawnObjects.trunk3.row, spawnObjects.trunk1.speed)));
  gameBoard.add(new Spawner(5.5,new Trunk(spawnObjects.trunk1.sprite,spawnObjects.trunk1.row, spawnObjects.trunk1.speed)));
  gameBoard.add(new Spawner(4.5,new Trunk(spawnObjects.trunk2.sprite,spawnObjects.trunk2.row, spawnObjects.trunk2.speed)));
  gameBoard.add(new Spawner(2.5,new Turtle(spawnObjects.turtle.row, spawnObjects.turtle.speed)));
  gameBoard.add(new Spawner(2.5,new Turtle(spawnObjects.turtle2.row, spawnObjects.turtle2.speed)));
  //gameBoard.add(new Trunk('trunk2',3,20));
  //gameBoard.add(new Trunk('trunk1',4,20));
  gameBoard.add(new Frog());
  gameBoard.add(new Water());
  gameBoard.add(new Home());
  Game.setBoard(1, gameBoard);
  //Game.setBoard(0,new Starfield(20,0.4,100,true))
  //Game.setBoard(1,new Starfield(50,0.6,100))
  //Game.setBoard(2,new Starfield(100,1.0,50));

  //var board = new GameBoard();
  //board.add(new PlayerShip());
  //board.add(new Level(level1,winGame));
  //Game.setBoard(3,board);
}

var winGame = function() {
  Game.setBoard(1,new TitleScreen("You win!", 
                                  "Press fire to play again",
                                  startGame));
};



var loseGame = function() {
  Game.setBoard(1,new TitleScreen("You lose!", 
                                  "Press fire to play again",
                                  startGame));
};


// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});
