function changeHexSize(direction, fine=false){
	var textBox = document.querySelector("input[name='" + "hex-size" + "']");
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
	var textBox = document.querySelector("input[name='" + "hex-size" + "']");
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
	var xCoord = document.querySelector("input[name='" + "view-coordinate-x" + "']");
	var yCoord = document.querySelector("input[name='" + "view-coordinate-y" + "']");
	var xChange = 0;
	var yChange = 0;
	switch(event.code){
		case "Equal":
			changeHexSize(1, event.shiftKey);
			break;
		case "Minus":
			changeHexSize(-1, event.shiftKey);
			break;
		case "KeyW":
			yChange--;
			break;
		case "KeyX":
			yChange++;
			break;
		case "KeyA":
			xChange--;
			yChange-=(xCoord.value%2==0);
			break;
		case "KeyZ":
			xChange--;
			yChange+=(xCoord.value%2!=0);
			break;
		case "KeyE":
			xChange++;
			yChange-=(xCoord.value%2==0);
			break;
		case "KeyD":
			xChange++;
			yChange+=(xCoord.value%2!=0);
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
