
var UNIT_X = [1, 0, 0];
var UNIT_Y = [0, 1, 0];
var UNIT_Z = [0, 0, 1];


function deg2rad(ang) {
	return ang / 57.2957795;
}


// returns an array of length 0, 1, or 2 based on how many values the equation results in
function quadratic(a, b, c) {
	var dis = b*b - 4 * a * c;

	if (dis < 0) {
		return [];
	}
	else if (dis == 0) {
		return [ -b / (2*a) ];
	}
	else {
		dis = Math.sqrt(dis);
		return [
			(-b + dis) / (2*a),
			(-b - dis) / (2*a),
		];
	}
}


// takes a vec2 point and 2 vec2 pts defining the upper left and lower right
// points of a rectangle and returns true if that point is inside the rectangle
function pointInRectangle(pt, a, b) {
	return (pt[0] >= a[0] && pt[0] <= b[0] &&
			pt[1] <= a[1] && pt[1] >= b[1]);
}


// takes a vec2 pt, a vec2 center, and a radius, and returns true if the point is
// inside the circle defined by that center and radius
function pointInCircle(pt, center, radius) {
	var squaredRadius = radius * radius;
	var ptDistSquared = vec2.squaredDistance(pt, center);
	return (squaredRadius <= ptDistSquared);
}


// takes a line defined by two vec2s a and b, and a circle defined by a vec2 center
// and a radius, and returns true if that line intersects with that circle
function lineIntersectsCircle(a, b, center, radius) {
	var d = [0, 0];
	vec2.sub(d, b, a);

	var f = [0, 0];
	vec2.sub(f, a, center);

	var t = quadratic(
		vec2.dot(d, d),
		2 * vec2.dot(f, d),
		vec2.dot(f, f) - radius * radius
	);

	if (t.length == 0) {
		return false;
	}
	else {
		if (t[0] >= 0 && t[0] <= 1) {
			return true;
		}

		if (t.length == 2 && t[1] >=0 && t[1] <= 1) {
			return true;
		}

		return false;
	}
}


function quatAxis(q) {
	var s = Math.sqrt(1.0 - q[3] * q[3]);
	return [q[0]/s, q[1]/s, q[2]/s];
}


function quatAngle(q) {
	return 2 * Math.acos(q[3]);
}


function quatDirection(q) {
	var dir = [0, 0, 1];
	vec3.transformQuat(dir, dir, q);
	return dir;
}


function mat3_to_mat4(m) {
	return [
		m[0], m[1], m[2], 0,
		m[3], m[4], m[5], 0,
		m[6], m[7], m[8], 0,
		0,    0,    0,    1];
}


function vec3_swapYZ(vec) {
	//var v = vec3.clone(vec);
	//var rotMatrix = mat3.create();
	//mat3.rotate(rotMatrix, rotMatrix, deg2rad(-180));

	//var q = quatFromEulerAngles(0, 0, 0);
	//vec3.transformQuat(vec, vec, q);

	var tmp = vec[2];
	vec[2] = -vec[1];
	vec[1] = tmp;

	//vec3.transformMat3(vec, vec, rotMatrix);
	return vec;
}


function vec3_abs(vec) {
	vec[0] = Math.abs(vec[0]);
	vec[1] = Math.abs(vec[1]);
	vec[2] = Math.abs(vec[2]);
	return vec;
}


function quat_swapYZ(q) {
	if (q[0] == 0 && q[1] == 0 && q[2] == 0 && q[3] == 1) {
		return q;
	}
	var axis = quatAxis(q);
	var angle = quatAngle(q); // in radians
	aiswap(axis, 1, 2); // swap y and z
	axis[2] = -axis[2];
	quat.setAxisAngle(q, axis, angle);
	return q;
}


function mat4_swapYZ(mat) {
	//[0, 1, 2, 3,
	// 4, 5, 6, 7,
	// 8, 9, 10,11,
	// 12,13,14,15]

	// swap second and third columns
	aiswap(mat, 1, 2);
	aiswap(mat, 5, 6);
	aiswap(mat, 9, 10);
	aiswap(mat, 13, 14);

	// swap second and third rows
	aiswap(mat, 4, 8);
	aiswap(mat, 5, 9);
	aiswap(mat, 6, 10);
	aiswap(mat, 7, 11);
}


function mat3_swapYZ(mat) {
	//[0, 1, 2,
	// 3, 4, 5,
	// 6, 7, 8]

	// swap second and third columns
	aiswap(mat, 1, 2);
	aiswap(mat, 4, 5);
	aiswap(mat, 7, 8);

	// swap second and third rows
	aiswap(mat, 3, 6);
	aiswap(mat, 4, 7);
	aiswap(mat, 5, 8);
}


// array index swap. takes an array and two indices and swaps in-place
function aiswap(arr, i1, i2) {
	var tmp = arr[i1];
	arr[i1] = arr[i2];
	arr[i2] = tmp;
}


function quatFromAxisAngle(axis, angle) {
	var q = quat.create();
	return quat.setAxisAngle(q, axis, deg2rad(angle));
}


function quatFromEulerAngles(x, y, z) {
    var q = quat.create();
    quat.rotateX(q, q, deg2rad(x));
    quat.rotateY(q, q, deg2rad(y));
    quat.rotateZ(q, q, deg2rad(z));
    return q;
}


function clamp(val, min, max) {
	return Math.max(min, Math.min(val, max));
}



// http://stackoverflow.com/questions/646628/javascript-startswith
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

