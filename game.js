var levelFrogger = [];


// Especifica lo que se debe pintar al cargar el juego
var startGame = function() {
  Game.setBoard(0,new TitleFrogger());
  Game.setBoard(1,new TitleScreen("",
                                  "Press space to start playing",
                                  playGame));

 levelFrogger = [
[3,new Car(spawnObjects.car1.sprite, spawnObjects.car1.row, spawnObjects.car1.speed)],
[2.5,new Car(spawnObjects.car2.sprite, spawnObjects.car2.row, spawnObjects.car2.speed)],
[3,new Car(spawnObjects.car3.sprite, spawnObjects.car3.row, spawnObjects.car3.speed)],
[3.5,new Car(spawnObjects.car4.sprite, spawnObjects.car4.row, spawnObjects.car4.speed)],
[2.5,new Car(spawnObjects.car5.sprite, spawnObjects.car5.row,spawnObjects.car5.speed)],
[3,new Trunk(spawnObjects.trunk1.sprite,spawnObjects.trunk1.row, spawnObjects.trunk1.speed)],
[2,new Trunk(spawnObjects.trunk2.sprite,spawnObjects.trunk2.row, spawnObjects.trunk2.speed)],
[3,new Trunk(spawnObjects.trunk3.sprite,spawnObjects.trunk3.row, spawnObjects.trunk1.speed)],
[2,new Turtle(spawnObjects.turtle.row, spawnObjects.turtle.speed)],
[2.5,new Turtle(spawnObjects.turtle2.row, spawnObjects.turtle2.speed)]
];
}


var playGame = function() {
  Game.lives = 3;
  var boardBg = new GameBoard();
  boardBg.add(new Background());
  Game.setBoard(0, boardBg);
  var gameBoard = new GameBoard();
  gameBoard.add(new LevelFrogger(levelFrogger));
  gameBoard.add(new Frog());
  gameBoard.add(new Water());
  gameBoard.add(new Home());
  Game.setBoard(1, gameBoard);
  
}

var winGame = function() {
  Game.setBoard(1,new TitleScreen("You win!", 
                                  "Press space to play again",
                                  startGame));
};



var loseGame = function() {
  Game.setBoard(1,new TitleScreen("You lose!", 
                                  "Press space to play again",
                                  startGame));
};


// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});
