var board = new DOMBoard( document.querySelector("div.main-block") );
board.attachHandlers();

var game = new SimonGame(board);
game.attachHandlers();
