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

	this.skyColorDay = [1, 0.5, 0.2];
	this.skyColorNight = [0.1, 0.2, 0.3];
	this.sunSpeed = 15;
	this.sunAngle = 0;

	this.lanternTimer = 0;


	this.init = function() {
		// tell the input system we want all input events (requires inputEvent(key,evt) method)
		input.addUpdateObject(this);

		this.scene = loadJSONScene('alienPlanetScene.json');

		// tell the engine we want update() to get called every frame
		engine.addUpdateObject(this);
	};


	this.resetCamera = function() {
		this.camHoriz = -257.17004776000977;
		this.camVert = 70.87000846862793;
		engine.camera.position = [5.635998493991792, 33.160001266980544, -35.63893827940954];
		engine.camera.orientation = [-0.45300182700157166, -0.6256833672523499, -0.37243011593818665, -0.5143982172012329];
		engine.camera.recalculate();
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
		if (input.keyIsDown("A")) {
			movementVec[1] -= this.camSpeed * timeSinceLastFrame;
		}
		if (input.keyIsDown("D")) {
			movementVec[1] += this.camSpeed * timeSinceLastFrame;
		}
		if (input.keyIsDown("Space")) {
			movementVec[0] += this.camSpeed * timeSinceLastFrame;
		}
		if (input.keyIsDown("C")) {
			movementVec[0] -= this.camSpeed * timeSinceLastFrame;
		}
		// zooming/fov
		if (input.keyIsDown("F")) {
			engine.camera.fovy += timeSinceLastFrame;
		}
		if (input.keyIsDown("R")) {
			engine.camera.fovy -= timeSinceLastFrame;
		}

		if (input.keyIsDown("P")) {
			this.resetCamera();
		}

		vec3.transformQuat(movementVec, [movementVec[0], movementVec[2], -movementVec[1]], engine.camera.orientation);
		vec3.add(engine.camera.position, engine.camera.position, movementVec);
		engine.camera.recalculate();

		// calculate where the mouse has moved since the last frame
		var mouseDelta = vec2.create();
		vec2.sub(mouseDelta, input.mousePos, this.lastMousePos);


		// lantern animation
		this.lanternTimer += timeSinceLastFrame;
		if (this.lanternTimer > 2.5) this.lanternTimer = -2.5;

		for (var i = this.scene.length - 1; i >= 0; i--) {
			var obj = this.scene[i];
			if (obj.name.startsWith("Sphere")) {
				obj.position[1] += 0.5 * timeSinceLastFrame * this.lanternTimer * 0.4;
			}
		};


		// camera movement
		if (input.keyIsDown("MouseButton")) {
			this.camHoriz += mouseDelta[0] * 5 * timeSinceLastFrame;
			this.camVert -= mouseDelta[1] * 5 * timeSinceLastFrame;

			this.camHoriz %= 360;
			this.camVert %= 360;

			var q = quat.create();
			quat.rotateY(q, q, deg2rad(this.camHoriz));
			quat.rotateZ(q, q, deg2rad(this.camVert));
			engine.camera.orientation = q;

			engine.camera.recalculate();
		}

		// sun direction and sky light
		var sunRot = quatFromEulerAngles(0, this.sunAngle, 0);
		var sunScalar = this.sunAngle / 360;
		var sky = vec3.clone(engine.skyColor);
		if (sunScalar < 0.05) {
			var t = (sunScalar * 10) + 0.5;
			vec3.lerp(sky, this.skyColorNight, this.skyColorDay, t);
		}
		else if (sunScalar > 0.95) {
			var t = (sunScalar - 0.95) * 10;
			vec3.lerp(sky, this.skyColorNight, this.skyColorDay, t);
		}
		else if (sunScalar >= 0.05 || sunScalar <= 0.5) {
			var t = (sunScalar * 2);
			vec3.lerp(sky, this.skyColorDay, this.skyColorNight, t);
		}
		else if (sunScalar > 0.5 || sunScalar <= 0.95) {
			var t = (sunScalar * 2) - 1.0;
			vec3.lerp(sky, this.skyColorNight, this.skyColorDay, t);
		}
		engine.setSkyColor(sky);
		engine.light.setDirection(quatDirection(sunRot));

		this.sunAngle += this.sunSpeed * timeSinceLastFrame;
		this.sunAngle %= 360;

		// save the mouse pos so we can get a delta next frame
		this.lastMousePos = vec2.clone(input.mousePos);
	};
}



function AlienPlanetSetup() {
	alien = new AlienPlanet();
	alien.init();
}
