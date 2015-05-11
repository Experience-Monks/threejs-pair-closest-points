var octSort = require('./utils/octTreeSort');
function pairClosestPoints(vertsA, vertsB) {
	octSort(vertsA);
	octSort(vertsB);
}

module.exports = pairClosestPoints;