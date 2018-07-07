var canvas = document.querySelector('canvas')

canvas.width=window.innerWidth * (49.0 / 100.0);
canvas.height=window.innerHeight;

var c = canvas.getContext('2d');

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function drawHexagon(centerX, centerY) {
	r = parseFloat(document.querySelector("input[name='hex-distance']").value)/2;
	R = r / Math.cos(Math.PI / 6)
	console.log(r);
	console.log(R);
	c.fillStyle = getRandomColor();
	c.beginPath();
	c.moveTo(centerX + R, centerY);
	c.lineTo(centerX + R/2, centerY + r);
	c.lineTo(centerX - R/2, centerY + r);
	c.lineTo(centerX - R, centerY);
	c.lineTo(centerX - R/2, centerY - r);
	c.lineTo(centerX + R/2, centerY - r);
	c.closePath();
	c.fill();
}
drawHexagon(0, 0)
