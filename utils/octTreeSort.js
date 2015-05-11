var octTreeModes = {
	NORMAL : 0,
	SUPER_X : 1
};

var tree = [];
var recurseTreeSortSuperX = function(vertices, loop) {
	loop--;
	vertices.sort(function(a, b) {return b.x - a.x});
	var tempLow = vertices.slice(0, ~~(vertices.length * .5));
	if (tempLow.length >= 2) {
		if(loop) tempLow = recurseTreeSortSuperX(tempLow, loop);
		else tempLow = recurseTreeSortY(tempLow);
	}
	var tempHigh = vertices.slice(~~(vertices.length * .5), vertices.length);
	if (tempHigh.length >= 2) {
		if(loop > 0) tempHigh = recurseTreeSortSuperX(tempHigh, loop);
		else tempHigh = recurseTreeSortY(tempHigh);
	}
	return [tempLow, tempHigh];
}
var recurseTreeSortX = function(vertices) {
	vertices.sort(function(a, b) {return b.x - a.x});
	var tempLow = vertices.slice(0, ~~(vertices.length * .5));
	if (tempLow.length >= 2) tempLow = recurseTreeSortY(tempLow);
	var tempHigh = vertices.slice(~~(vertices.length * .5), vertices.length);
	if (tempHigh.length >= 2) tempHigh = recurseTreeSortY(tempHigh);
	return [tempLow, tempHigh];
}
var recurseTreeSortY = function(vertices) {
	vertices.sort(function(a, b) {return b.y - a.y});
	var tempLow = vertices.slice(0, ~~(vertices.length * .5));
	if (tempLow.length >= 2) tempLow = recurseTreeSortZ(tempLow);
	var tempHigh = vertices.slice(~~(vertices.length * .5), vertices.length);
	if (tempHigh.length >= 2) tempHigh = recurseTreeSortZ(tempHigh);
	return [tempLow, tempHigh];
}
var recurseTreeSortZ = function(vertices) {
	vertices.sort(function(a, b) {return b.z - a.z});
	var tempLow = vertices.slice(0, ~~(vertices.length * .5));
	if (tempLow.length >= 2) tempLow = recurseTreeSortX(tempLow);
	var tempHigh = vertices.slice(~~(vertices.length * .5), vertices.length);
	if (tempHigh.length >= 2) tempHigh = recurseTreeSortX(tempHigh);
	return [tempLow, tempHigh];
}

var recurseUnroll = function(arrTree, arrFlat) {
	for (var i = 0; i < arrTree.length; i++) {
		if (arrTree[i] instanceof Array) recurseUnroll(arrTree[i], arrFlat);
		else arrFlat.push(arrTree[i]);
	};
}

function octTreeSort(vertices) {
	var timeBefore = new Date;
	var total = vertices.length;
	
	switch(octTreeSort.mode) {
		case octTreeModes.SUPER_X:
			vertices = recurseTreeSortSuperX(vertices, 8);
			break;
		default: 
			vertices = recurseTreeSortY(vertices);
	}
	var arrFlat = [];
	var timeMiddle = new Date;
	
	recurseUnroll(vertices, arrFlat);
	var timeAfter = new Date;

	while(vertices.length > 0) vertices.pop();
	for (var i = arrFlat.length - 1; i >= 0; i--) {
		vertices.push(arrFlat[i]);
	};
}

octTreeSort.mode = octTreeModes.NORMAL;
octTreeSort.modes = octTreeModes;

module.exports = octTreeSort;
