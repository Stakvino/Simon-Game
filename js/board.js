var DOM = Object.create(null);
DOM.replaceClass = function(DOMelement, oldCLass, newClass){
  DOMelement.classList.remove(oldCLass);
  DOMelement.classList.add(newClass);
}

var audioTunes = document.querySelectorAll("div.game-board audio");

class DOMBoard {
  constructor(mainBox) {
    this.countScreen  = mainBox.querySelector("div.count-screen label");
    this.startButton  = mainBox.querySelector("div.start-box button");
    this.strictButton = mainBox.querySelector("div.strict-box button");
    this.strcitLed    = mainBox.querySelector("div.strict-led");
    this.switchBox    = mainBox.querySelector("div.on-off-switch");
    this.switchButton = mainBox.querySelector("div.on-off-switch button");

    this.tuneButtons = {

      "green"  : {
        DOM   : mainBox.querySelector("div.green"),
        audio : audioTunes[0]
      },
      "red"    : {
        DOM   : mainBox.querySelector("div.red"),
        audio : audioTunes[1]
      },
      "yellow" : {
        DOM   : mainBox.querySelector("div.yellow"),
        audio : audioTunes[2]
      },
      "blue"   : {
        DOM   : mainBox.querySelector("div.blue"),
        audio : audioTunes[3]
      }

    };

    this.sequencesTimout = [];
    this.boardIsOn     = false;
    this.canPLayTunes  = false;
  }

  attachHandlers(){

    this.switchBox.addEventListener("click", function(){
      if (this.boardIsOn){
        this.turnOffBoard();
      }else{
        this.turnOnBoard();
      }
    }.bind(this));

  }

  turnOffBoard(){
    DOM.replaceClass(this.switchButton, "switch-on", "switch-off");
    this.clearSequencesTimout();
    this.countScreen.textContent = "";
    this.boardIsOn = false;
    DOM.replaceClass(this.strcitLed, "on-led", "off-led");
  }

  turnOnBoard(){
    DOM.replaceClass(this.switchButton, "switch-off", "switch-on");
    this.countScreen.textContent = "--";
    this.boardIsOn = true;
  }

  blinkCountScreen(times){
    var originalText = this.countScreen.textContent;

    for (var i = 0; i < times; i++) {

      setTimeout(function(){
        this.countScreen.textContent = "";
        setTimeout(function(){
          this.countScreen.textContent = originalText;
        }.bind(this), 300);
      }.bind(this), ( (2 * i) + 1 ) * 300 );

    }
  }

  activateTuneButtons(){
    this.canPLayTunes = true;
    for (var color in this.tuneButtons){
      this.tuneButtons[color].DOM.classList.add("activated");
      this.tuneButtons[color].DOM.addEventListener("click", activateAudio(color).bind(this) );
    }
  }

  deactivateTuneButtons(){
    this.canPLayTunes = false;
    for (var color in this.tuneButtons){
      this.tuneButtons[color].DOM.classList.remove("activated");
      this.tuneButtons[color].DOM.removeEventListener("click", activateAudio(color).bind(this) );
    }
  }

  playSequences(sequences,delay){
    this.sequencesTimout = [];

    for (var i = 0; i < sequences.length; i++) {
      var timeOfOneSequence = delay/2;
      var delayBetweenSequences   = ( (2 * i) + 1 ) * delay/2;
      this.sequencesTimout.push( setTimeout(playSequence(sequences[i], this.tuneButtons, timeOfOneSequence)
                                          .bind(this), delayBetweenSequences) );
    }

  }

  clearSequencesTimout(){
    for (var i = 0; i < this.sequencesTimout.length; i++) {
      clearTimeout(this.sequencesTimout[i]);
    }
  }

}

/*******************************************************************************/

function activateAudio(color){

  return function(){
    if (this.canPLayTunes) {
      this.tuneButtons[color].audio.play();
    }
  }

}

function playSequence(currentSequence, tuneButtons, delay){

  return function bright(){
    if (this.boardIsOn) {
      tuneButtons[currentSequence].DOM.classList.add("bright");
      tuneButtons[currentSequence].audio.play();
      setTimeout(function dark(){
        tuneButtons[currentSequence].DOM.classList.remove("bright");
      }, delay);
    }
  };

}
