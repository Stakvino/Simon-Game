
var switchBut   = document.querySelector("div.on-off-switch button");
var countScreen = document.querySelector("div.count-screen");

switchBut.addEventListener("click",function(){

  if ( this.classList.contains("switch-on") ) {
    this.classList.remove("switch-on");
    this.classList.add("switch-off");
    countScreen.textContent = "";
  } else {
    this.classList.remove("switch-off");
    this.classList.add("switch-on");
    countScreen.textContent = "--";
  }

});

var strictLed = document.querySelector("div.strict-led");

document.querySelector("div.strict-box button").addEventListener("click",function(){

  if ( strictLed.classList.contains("off-led") ) {
    strictLed.classList.remove("off-led");
    strictLed.classList.add("on-led");
  } else {
    strictLed.classList.remove("on-led");
    strictLed.classList.add("off-led");
  }

});
