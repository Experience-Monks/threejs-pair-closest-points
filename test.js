THREE = require('three');
var closestPairs = require('./');
// var closestPairs = require('./shortestTotalDistancePairing.js');
var View = require('threejs-managed-view').View;

var view = new View({
	useRafPolyfill: false
});
var scene = view.scene;



var ballGeometry = 	new THREE.SphereGeometry(.1, 16, 8);

var total = 6;
var boundSize = 5;

var boundMatrixA = new THREE.Matrix4();
var randomVector = new THREE.Vector3(Math.random(), Math.random(), Math.random());
var boundSizeA = 1;
var boundSizeB = 4;
randomVector.normalize().multiplyScalar(3);
boundMatrixA.compose(
	randomVector,
	(new THREE.Quaternion()).setFromEuler(new THREE.Euler(0, 0, 0)),
	new THREE.Vector3(boundSizeA, boundSizeA, boundSizeA)
);

var boundMatrixB = new THREE.Matrix4();
boundMatrixB.compose(
	randomVector.clone().multiplyScalar(-1),
	(new THREE.Quaternion()).setFromEuler(new THREE.Euler(0, 0, 0)),
	new THREE.Vector3(boundSizeB, boundSizeB, boundSizeB)
);

var datasA = [];
var datasB = [];
for (var i = 0; i < total; i++) {
	var color = new THREE.Color();
	color.setHSL(i/total * 0.25, 1, 0.5);
	var colorB = new THREE.Color();
	colorB.setHSL(i/total * 0.25 + 0.5, 1, 0.5);

	var dataA = new THREE.Vector3(
		(Math.random() - 0.5) * 2,
		(Math.random() - 0.5) * 2,
		(Math.random() - 0.5) * 2
	).applyMatrix4(boundMatrixA);

	var dataB = new THREE.Vector3(
		(Math.random() - 0.5) * 2,
		(Math.random() - 0.5) * 2,
		(Math.random() - 0.5) * 2
	).applyMatrix4(boundMatrixB);

	dataA.color = color;
	dataB.color = colorB;
	datasA.push(dataA);
	datasB.push(dataB);
};

function makeBallFromData(data, i) {
	var dataBall = new THREE.Mesh(
		ballGeometry,
		new THREE.MeshBasicMaterial({
			color: data.color
		})
	);
	scene.add(dataBall);
	dataBall.position.copy(data);
}


datasA.forEach(makeBallFromData);

datasB.forEach(makeBallFromData);

// closestPairs(datas, datasB);

var whiteLineMaterial = new THREE.LineBasicMaterial({
	color: 0xffffff,
	vertexColors: THREE.VertexColors
});

function drawLine(dataA, dataB) {
	var geometry = new THREE.Geometry();
	geometry.vertices.push(dataA, dataB);
	geometry.colors = [dataA.color, dataB.color];
	var line = new THREE.Line(geometry, whiteLineMaterial);
	scene.add(line);
}

var inbetweenDatas = [];
var inbetweenBalls = [];
function makeInbetweenBalls(dataA, dataB) {
	var inbetweenBall = new THREE.Mesh(
		ballGeometry,
		new THREE.MeshBasicMaterial({
			color: dataA.color.clone().lerp(dataB.color, 0.5)
		})
	);
	var inbetweenData = dataA.clone().lerp(dataB, 0.5);
	inbetweenBall.position.copy(inbetweenData);
	inbetweenData.dataA = dataA;
	inbetweenData.dataB = dataB;
	scene.add(inbetweenBall);
	inbetweenDatas.push(inbetweenData);
	inbetweenBalls.push(inbetweenBall);
}

setTimeout(function() {
	for (var i = 0; i < total; i++) {
		// drawLine(datas[i], datasB[i]);
	};
	closestPairs(datasA, datasB);
	for (var i = 0; i < total; i++) {
		drawLine(datasA[i], datasB[i]);
	};

	for (var i = 0; i < total; i++) {
		makeInbetweenBalls(datasA[i], datasB[i]);
	};

	var boundingBoxGeometryA = new THREE.Geometry();
	var boundingBoxGeometryB = new THREE.Geometry();
	var boundingBoxGeometryInbetween = new THREE.Geometry();
	inbetweenDatas.forEach(function(data) {
		boundingBoxGeometryInbetween.vertices.push(data);
		boundingBoxGeometryA.vertices.push(data.dataA);
		boundingBoxGeometryB.vertices.push(data.dataB);
	})

	var boundingBoxA = new THREE.Mesh(boundingBoxGeometryA);
	var boundingBoxB = new THREE.Mesh(boundingBoxGeometryB);
	var boundingBoxInbetween = new THREE.Mesh(boundingBoxGeometryInbetween);
	var boundingBoxHelperA = new THREE.BoxHelper(boundingBoxA);
	var boundingBoxHelperB = new THREE.BoxHelper(boundingBoxB);
	var boundingBoxHelperInbetween = new THREE.BoxHelper(boundingBoxInbetween);
	scene.add(boundingBoxHelperA);
	scene.add(boundingBoxHelperB);
	scene.add(boundingBoxHelperInbetween);
	boundingBoxHelperA.material.color.set(0xff7f7f);
	boundingBoxHelperB.material.color.set(0x7fffff);

	view.renderManager.onEnterFrame.add(function() {
		var ratio = Math.sin((new Date()).getTime() * 0.002) * 0.5 + 0.5;
		boundingBoxGeometryInbetween.computeBoundingBox();
		inbetweenDatas.forEach(function(data, i) {
			var ball = inbetweenBalls[i];
			data.copy(data.dataA).lerp(data.dataB, ratio);
			ball.material.color.copy(data.dataA.color).lerp(data.dataB.color, ratio);
			ball.position.copy(data);
		});
		boundingBoxHelperInbetween.update(boundingBoxInbetween);
		boundingBoxHelperInbetween.material.color.copy(boundingBoxHelperA.material.color).lerp(boundingBoxHelperB.material.color, ratio);
	})
}, 100);
