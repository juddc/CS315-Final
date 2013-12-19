
// game global:
var alien;


function AlienPlanet() {
	// GameObjects:
	this.scene = [];

	// vars
	this.camSpeed = 9.0;


	this.init = function() {
		// tell the input system we want all input events (requires inputEvent(key,evt) method)
		input.addUpdateObject(this);

		var sceneFile = 'alienPlanetScene.json';
		//var sceneFile = 'simpleScene.json';
		var SCENE = DATA[sceneFile]['objects'];
		for (var i = SCENE.length - 1; i >= 0; i--) {
			var data = SCENE[i];
			var obj = new GameObject(data.name, data.name);

			vec3_swapYZ(data.position);
			vec3_swapYZ(data.rotation);
			vec3_swapYZ(data.scale);

			obj.position = vec3.clone(data.position);
			obj.rotation = vec3.clone(data.rotation);
			obj.scale = vec3.clone(data.scale);
			this.scene.push(obj);

			engine.addGameObject(obj);
		};

		var CAM = DATA[sceneFile]['camera'];
		vec3_swapYZ(CAM.position);

		engine.camera.position = vec3.clone(CAM.position);
		engine.camera.lookAt = [30.5, 48.4, -13.67];
		//engine.camera.lookAt = [0, 0, 0];
		engine.camera.near = CAM.nearclip;
		engine.camera.far = CAM.farclip;
		engine.camera.fovy = 45.0;
		engine.camera.recalculate();

		//engine.light.position = vec3.clone(CAM.position);
		engine.light.position = [10, 10, 50];

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
	};


	this.update = function(timeSinceLastFrame) {
		// check up/down keys for player 2
		if (input.keyIsDown("W")) {
			engine.camera.position[1] += this.camSpeed * timeSinceLastFrame;
			engine.camera.recalculate();
		}
		else if (input.keyIsDown("S")) {
			engine.camera.position[1] -= this.camSpeed * timeSinceLastFrame;
			engine.camera.recalculate();
		}
		else if (input.keyIsDown("D")) {
			engine.camera.position[0] += this.camSpeed * timeSinceLastFrame;
			engine.camera.recalculate();
		}
		else if (input.keyIsDown("A")) {
			engine.camera.position[0] -= this.camSpeed * timeSinceLastFrame;
			engine.camera.recalculate();
		}

		else if (input.keyIsDown("R")) {
			engine.camera.fovy += timeSinceLastFrame;
			engine.camera.recalculate();
		}
		else if (input.keyIsDown("F")) {
			engine.camera.fovy -= timeSinceLastFrame;
			engine.camera.recalculate();
		}


		/*
		// test collisions for each block
		for (var i = this.blocks.length - 1; i >= 0; i--) {
			var block = this.blocks[i];
			var p1 = this.paddle1;
			var p2 = this.paddle2;

			// if the ball intersects with the block
			if(this.ball.collider.intersects(block.collider)){//if (this.ball.collider.intersects(p1.collider) || this.ball.collider.intersects(p2.collider) ) {
				this.dirFlip = !this.dirFlip; // flip ball direction
				block.color = [0, 1, 1]; // debug: change block color for a sec
			}
			else {
				block.color = [1, 0, 0]; // debug: reset ball color
			}
		}

		// move ball based on the dirFlip boolean
		if (this.dirFlip == true) {
			this.ball.position[2] += 5 * timeSinceLastFrame;
		}
		else {
			this.ball.position[2] -= 5 * timeSinceLastFrame;
		}

		// put the light right above the ball
		engine.light.position[0] = this.ball.position[0];
		engine.light.position[1] = this.ball.position[1] + 10.0;
		engine.light.position[2] = this.ball.position[2];
		*/
	};
}



function AlienPlanetSetup() {
	alien = new AlienPlanet();
	alien.init();
}
