function getRandomEelement(array){
  return array[Math.floor( Math.random() * array.length )];
}

class SimonGame {
  constructor(board) {
    this.board     = board;
    this.colors    = ["green","red","yellow","blue"];
    this.level     = "00";
    this.sequences = [];
    this.gameMode  = "normal";
    this.sequenceDelay = 1.2;    // time between sequence animation (seconds)
    this.playerResponseTime = 4;
    this.playerSequences    = [];
    this.levelStepsTimeouts = [];

    this.isRunning    = false;
  }

  attachHandlers(){

    board.switchBox.addEventListener("click",function(){
      if (this.isRunning){
        this.isRunning = false;
        this.level = "00";
        this.gameMode  = "normal";
        this.sequences = [];

        this.clearTimeOut();
      }
    }.bind(this) );

    board.strictButton.addEventListener("click",function(){
      if (board.boardIsOn && !this.isRunning) {
        if ( board.strcitLed.classList.contains("off-led") ) {
          DOM.replaceClass(board.strcitLed, "off-led", "on-led");
          this.gameMode = "strict";
        } else {
          DOM.replaceClass(board.strcitLed, "on-led", "off-led");
          this.gameMode = "normal";
        }
      }
    }.bind(this));

    board.startButton.addEventListener("click",function(){
      if (board.boardIsOn && !this.isRunning) {
        this.startGame();
      }
    }.bind(this));


    for (var color in board.tuneButtons){

      board.tuneButtons[color].DOM.addEventListener("click",(function(color){
        return function(){
          if (board.canPLayTunes) {
            this.playerSequences.push(color);
          }
          if (this.sameSequences() ) {
            //Player Succed stop sequences and run next level after a second
            this.clearTimeOut();
            this.upgradeLevel();
            setTimeout(function(){ this.runLevel(); }.bind(this), 1000);
          }
        }.bind(this);
      }.bind(this) )(color)
    );

    }

  }

  clearTimeOut(){
    for (var i = 0; i < this.levelStepsTimeouts.length; i++) {
      clearTimeout(this.levelStepsTimeouts[i]);
    }
  }

  upgradeLevel(){
    this.level = "0" + (Number(this.level) + 1)
    this.sequences.push( getRandomEelement(this.colors) );
  }

  resetGame(){
    this.level = "01";
    this.sequences = [];
    this.sequences.push( getRandomEelement(this.colors) );
  }

  initGame(){
    if (!this.isRunning) {
      this.isRunning = true;
      board.blinkCountScreen(2);
      this.upgradeLevel(); // go to level 01 to start
    }
  }

  runSequence(){
    if (this.isRunning) {
      board.countScreen.textContent = this.level;
      board.playSequences(this.sequences,this.sequenceDelay * 1000);
    }
  }

  failedMessage(){
    if (this.isRunning){
      board.countScreen.textContent = "!!";
      board.blinkCountScreen(3);
    }
  }

  sameSequences(){

    if (this.sequences.length !== this.playerSequences.length ) return false;

    for (var i = 0; i < this.sequences.length; i++) {
      if ( this.sequences[i] !== this.playerSequences[i] ) return false;
    }

    return true;
  }

  runLevel(){
    this.levelStepsTimeouts = [];
    this.playerSequences    = [];

    if (board.boardIsOn) {
      var ID = setTimeout(function(){
                // wait 2 seconds before running sequences
                board.deactivateTuneButtons();
                this.runSequence();
                var sequencesDelay = this.sequenceDelay * 1000 * this.sequences.length;

                var ID = setTimeout(function(){
                          //take player input after the sequences
                          board.activateTuneButtons();
                          console.log("sequences finished");
                          var ID = setTimeout(function(){
                                    // too late try again or start again if you are in strict mode
                                    board.deactivateTuneButtons();
                                    this.failedMessage();
                                    if (this.gameMode === "strict") {
                                      this.resetGame();
                                    }
                                    //wait for failed message before runing level again
                                    setTimeout(function(){ this.runLevel(); }.bind(this),2000);

                                  }.bind(this),this.playerResponseTime * 1000);
                          this.levelStepsTimeouts.push(ID);

                        }.bind(this),sequencesDelay);
                this.levelStepsTimeouts.push(ID);

              }.bind(this),1000);
       this.levelStepsTimeouts.push(ID);
    }

  }

  startGame(){
    this.initGame();
    setTimeout(function(){ this.runLevel(); }.bind(this), 1000);
  }


}
