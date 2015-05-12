var shortestTotalDistancePairing = require('./shortestTotalDistancePairing');
var octTreePairing = require('./octTreePairing');
function pairClosestPoints(vertsA, vertsB) {
	if(vertsA.length <= pairClosestPoints.maxVertsForGreedyAlgorithm) {
		shortestTotalDistancePairing(vertsA, vertsB);
	} else {
		octTreePairing(vertsA, vertsB);
	}
}
pairClosestPoints.maxVertsForGreedyAlgorithm = 6;	//6 factorial is 720 permutations, 7 is 5040, you don't even want 8

module.exports = pairClosestPoints;