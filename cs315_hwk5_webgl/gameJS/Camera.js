"use strict";

function Camera(gameEngine) {
    // keep a reference to the GameEngine object
    this.gameEngine = gameEngine;

    // matrices managed by the camera
    this.mViewMatrix = mat4.create();
    this.mProjectionMatrix = mat4.create();

    // camera config
    this.position = [0, 15, 0.1];
    this.orientation = quat.create();
    this.up = [0.0, 1.0, 0.0];
    this.near = 1.0;
    this.far = 100.0;
    this.fovy = 45.0;


    this._getLookAtVector = function() {
        quat.normalize(this.orientation, this.orientation);

        // figure out where the quaternion is pointing
        var dirVec = vec3.create();
        vec3.transformQuat(dirVec, UNIT_Y, this.orientation);

        // add it to the position
        var lookVec = vec3.create();
        vec3.add(lookVec, this.position, dirVec);

        return lookVec;
    };


    // must call recalculate after making any changes to the camera config
    this.recalculate = function(width, height) {
        if (width == null) width = this.gameEngine.canvas.clientWidth;
        if (height == null) height = this.gameEngine.canvas.clientHeight;

        // view matrix:
        mat4.lookAt(this.mViewMatrix, this.position, this._getLookAtVector(), this.up);

        // projection matrix:
        var ratio = width / height;
        mat4.perspective(this.mProjectionMatrix, this.fovy, ratio, this.near, this.far);
    };


    this.getProjectionMatrix = function() {
        return this.mProjectionMatrix;
    };


    this.getViewMatrix = function() {
        return this.mViewMatrix;
    };

}


