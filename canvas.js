var canvas = document.querySelector('canvas')

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

var c = canvas.getContext('2d');

c.fillStyle = 'rgba(255, 0, 0, 0.5)';
c.fillRect(100, 100, 100, 100);

// Line
c.beginPath();
c.moveTo(50, 300);
c.lineTo(300, 300);
c.lineTo(500, 500);
c.strokeStyle = "#f65309";
c.stroke();

// Arc
c.beginPath();
c.arc(300, 300, 30, 30, 0, Math.PI * 2, false);
c.strokeStyle = "#06f309";
c.stroke();

var x = 300;
var dx = 20;
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);

	c.beginPath();
	radius = 30
	c.arc(x, 300, radius, 30, 0, Math.PI * 2, false);
	c.strokeStyle = "#06f309";
	c.fillStyle = 'rgba(255, 0, 0, 0.5)';
	c.stroke();
	c.fill();

	if (x + radius > innerWidth || x - radius < 0 ){
		dx = -dx;
	}

	x+=dx;
}

animate();

window.addEventListener('resize', function()
		{
			canvas.width=window.innerWidth;
			canvas.height=window.innerHeight;
		});
