
// game global:
var breakout;


function Breakout() {
	// GameObjects:
	this.paddle = null;
	this.blocks = [];

	// Timers:
	this.rotTimer = 0;
	this.moveTimer = 0;
	this.dirFlip = true;


	this.init = function() {
		this.paddle = new GameObject("paddle", "fancycube", -4, 0);
		this.paddle.scale = [1, 4, 1];
		engine.addGameObject(this.paddle);

		// tell the engine we want update() to get called every frame
		engine.addUpdateObject(this);
	}


	this.update = function(timeSinceLastFrame) {
		//
		// calculate smooth rotation
		//
		this.rotTimer += timeSinceLastFrame;
		var angleInDegrees = (this.rotTimer * 20) % 360.0;
		this.paddle.rotation[1] = angleInDegrees;
		//
		// calculate movement
		//
		if (this.moveTimer > 1.0) {
			this.moveTimer = 0;
			this.dirFlip = !this.dirFlip; // toggle depth direction
		}
		else
			this.moveTimer += timeSinceLastFrame;

		if (this.dirFlip == true)
			vec3.lerp(this.paddle.position, this.paddle.position, this.paddle.position, (-this.moveTimer) + 1.0);
		else
			vec3.lerp(this.paddle.position, this.paddle.position, this.paddle.position, this.moveTimer);
	}
}



function BreakoutSetup() {
	breakout = new Breakout();
	breakout.init();
}
