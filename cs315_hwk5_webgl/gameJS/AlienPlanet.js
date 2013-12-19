"use strict";

// game global:
var alien;


function AlienPlanet() {
	// GameObjects:
	this.scene = [];

	// vars
	this.camSpeed = 9.0;
	this.camHoriz = 0;
	this.camVert = 0;
	this.lastMousePos = vec2.create();


	this.init = function() {
		// tell the input system we want all input events (requires inputEvent(key,evt) method)
		input.addUpdateObject(this);

		var sceneFile = 'alienPlanetScene.json';
		//var sceneFile = 'simpleScene.json';

		this.scene = loadJSONScene(sceneFile);

		/*
		// create the ball
		this.ball = new GameObject("ball", "Ball");
		this.ball.collider = new CircleCollider(this.ball);
		this.ball.position = [0, 0, 0];
		engine.addGameObject(this.ball);

		// create a block
		for (var i=0; i<2; i++) {
			var block = new GameObject("block_" + i, "FancyCube");
			block.collider = new RectangleCollider(block);
			block.position = [0, 0, i];
			engine.addGameObject(block);
			this.blocks.push(block);
		}
		this.blocks[0].position = [0, 0, -5];
		this.blocks[1].position = [0, 0, 5];

		// create the paddles
		this.paddle1 = new GameObject("paddle1", "Paddle");
		this.paddle1.collider = new RectangleCollider(this.paddle1, 0.6552, 4.608);
		this.paddle1.position = [11, 0, 0];
		this.paddle1.rotation = [0, 180, 0];
		engine.addGameObject(this.paddle1);

		this.paddle2 = new GameObject("paddle2", "Paddle");
		this.paddle2.collider = new RectangleCollider(this.paddle2, 0.6552, 4.608);
		this.paddle2.position = [-11, 0, 0];
		engine.addGameObject(this.paddle2);
		*/

		// tell the engine we want update() to get called every frame
		engine.addUpdateObject(this);
	};


	this.inputEvent = function(key, evt) {
		//console.log(key);
		//console.log(evt);

		if (key == "Shift" && evt.type == "keydown") {
			this.camSpeed = 30;
		}
		else if (key == "Shift" && evt.type == "keyup") {
			this.camSpeed = 9;
		}
	};


	this.update = function(timeSinceLastFrame) {
		// movement
		var movementVec = vec3.create();

		if (input.keyIsDown("W")) {
			movementVec[2] += this.camSpeed * timeSinceLastFrame;
		}
		if (input.keyIsDown("S")) {
			movementVec[2] -= this.camSpeed * timeSinceLastFrame;
		}
		if (input.keyIsDown("D")) {
			movementVec[0] -= this.camSpeed * timeSinceLastFrame;
		}
		if (input.keyIsDown("A")) {
			movementVec[0] += this.camSpeed * timeSinceLastFrame;
		}
		if (input.keyIsDown("Space")) {
			movementVec[1] += this.camSpeed * timeSinceLastFrame;
		}
		if (input.keyIsDown("C")) {
			movementVec[1] -= this.camSpeed * timeSinceLastFrame;
		}
		// zooming/fov
		if (input.keyIsDown("F")) {
			engine.camera.fovy += timeSinceLastFrame;
		}
		if (input.keyIsDown("R")) {
			engine.camera.fovy -= timeSinceLastFrame;
		}

		if (input.keyIsDown("P")) {
			this.camHoriz = -86.63001537322998;
			this.camVert = -3.1150221824645996;
			engine.camera.position = [-45.015682220458984, 53.40355682373047, -19.42580795288086];
			engine.camera.orientation = [0.5274806022644043, 0.4709184765815735, -0.4988862872123718, 0.5011112093925476];
			engine.camera.recalculate();
		}

		vec3.transformQuat(movementVec, [movementVec[0], movementVec[2], -movementVec[1]], engine.camera.orientation);
		vec3.add(engine.camera.position, engine.camera.position, movementVec);
		engine.camera.recalculate();

		// calculate where the mouse has moved since the last frame
		var mouseDelta = vec2.create();
		vec2.sub(mouseDelta, input.mousePos, this.lastMousePos);

		if (input.keyIsDown("MouseButton")) {
			this.camHoriz += mouseDelta[0] * 5 * timeSinceLastFrame;
			this.camVert += mouseDelta[1] * 5 * timeSinceLastFrame;

			engine.camera.orientation = quatFromEulerAngles(90, this.camVert, this.camHoriz);
			engine.camera.recalculate();
		}

		// save the mouse pos so we can get a delta next frame
		this.lastMousePos = vec2.clone(input.mousePos);
	};
}



function AlienPlanetSetup() {
	alien = new AlienPlanet();
	alien.init();
}
