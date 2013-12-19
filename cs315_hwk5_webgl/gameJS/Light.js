"use strict";

function Light() {
    this.direction = [0, 0, 1];


    this.setDirection = function(dir) {
    	vec3.normalize(dir, dir);
    	this.direction = dir;
    };
}
