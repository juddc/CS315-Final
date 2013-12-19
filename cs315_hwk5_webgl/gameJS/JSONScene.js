"use strict";


function loadJSONScene(sceneFile) {
	if (typeof engine == 'undefined') {
		addErrorMessage("Couldn't find an instance of GameEngine.");
		return;
	}

	if (typeof DATA == 'undefined') {
		addErrorMessage("Couldn't find DATA. Did you run data_compiler.py?");
		return;
	}

	var sceneObjects = [];

	// Create GameObjects for each object in the scene
	var SCENE = DATA[sceneFile]['objects'];
	for (var i = SCENE.length - 1; i >= 0; i--) {
		var data = SCENE[i];
		var obj = new GameObject(data.name, data.name);

		obj.position = vec3.clone(data.position);
		obj.orientation = quat.clone(data.orientation);
		obj.rotation = vec3.clone(data.rotation);
		obj.scale = vec3.clone(data.scale);
		obj.ambient = vec3.clone(data.ambient);
		obj.diffuse = vec3.clone(data.diffuse);
		obj.specular = vec3.clone(data.specular);
		obj.shininess = data.shininess;

		vec3_swapYZ(obj.position);
		quat_swapYZ(obj.orientation);
		vec3_swapYZ(obj.scale);
		vec3_abs(obj.scale); // can't support intentionally negative scales this way, but oh well

		sceneObjects.push(obj);

		engine.addGameObject(obj);
	};

	// Set up the camera based on scene data
	var CAM = DATA[sceneFile]['camera'];

	engine.camera.position = vec3.clone(CAM.position);
	engine.camera.orientation = quat.clone(CAM.orientation);

	vec3_swapYZ(engine.camera.position);
	quat_swapYZ(engine.camera.orientation);

	//engine.camera.lookAt = [30.5, 48.4, -13.67];
	//engine.camera.lookAt = [0, 0, 0];
	engine.camera.near = CAM.nearclip;
	engine.camera.far = CAM.farclip;
	engine.camera.fovy = 45.0;
	engine.camera.recalculate();

	// Set up lights based on scene data
	engine.light.position = vec3.clone(CAM.position);
	//engine.light.position = [10, 10, 50];

	return sceneObjects;
}
