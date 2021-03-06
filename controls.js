function changeViewScale(amount){
  var textBox = document.getElementById("View scale");
  textBox.value = parseInt(textBox.value) + amount;
  textBox.dispatchEvent(new Event('change'));
}

function changeHexSize(direction, fine=false){
  var textBox = document.getElementById("Hex size");
  var changeAmount = 0;
  if(!fine){
    changeAmount = Math.ceil(parseInt(textBox.value) / 10.0);
    if(changeAmount < 1){changeAmount=1;}
  }else{
    changeAmount=1;
  }
  textBox.value = parseInt(textBox.value) + changeAmount*direction;
  textBox.dispatchEvent(new Event('change'));
}

function MouseController(){
}

MouseController.prototype.wheel = function (event) {
  var textBox = document.getElementById("hex-size");
  var changeDirection = 0;
  if(event.deltaY > 0){ // Scroll down == zoom out
    changeDirection = -1;
  }
  if(event.deltaY < 0){ // Scroll up == zoom in
    changeDirection = 1;
  }
  changeHexSize(changeDirection, event.shiftKey);
}

function KeyboardController(){
}

KeyboardController.prototype.keyDown = function (event) {
  if(document.activeElement.tagName == "INPUT"){return;}
  var xCoord = document.getElementById("View coordinate X");
  var yCoord = document.getElementById("View coordinate Y");
  var xChange = 0;
  var yChange = 0;
  switch(event.code){
    case "Equal":
      changeHexSize(1, event.shiftKey);
      break;
    case "Minus":
      changeHexSize(-1, event.shiftKey);
      break;
    case "KeyS":
      changeViewScale(event.shiftKey ? 1 : -1);
      break;
    case "KeyW":
      yChange--;
      break;
    case "KeyX":
      yChange++;
      break;
    case "KeyA":
      xChange--;
      break;
    case "KeyD":
      xChange++;
      break;
    case "KeyE":
      xChange++;
      yChange--;
      break;
    case "KeyZ":
      xChange--;
      yChange++;
      break;
  }
  xCoord.value = parseInt(xCoord.value) + xChange;
  yCoord.value = parseInt(yCoord.value) + yChange;
  if(xChange!=0){
    xCoord.dispatchEvent(new Event('change'));
    return;
  }
  if(yChange!=0){
    yCoord.dispatchEvent(new Event('change'));
  }
}
