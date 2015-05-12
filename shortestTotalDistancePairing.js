//var octSort = require('./utils/octTreeSort');

function getDistance(vertA, vertB)
{
	return Math.sqrt(
		Math.pow(vertB.x  - vertA.x, 2) + 
		Math.pow(vertB.y  - vertA.y, 2) +
		Math.pow(vertB.z  - vertA.z, 2)
	);
}

function permutator(inputArr) {
  var results = [];

  function permute(arr, memo) {
    var cur, memo = memo || [];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }
    return results;
  }

  return permute(inputArr);
}

function pairClosestPoints(vertsA, vertsB) {

	var baseArr = [];
	for (var i = 0; i < vertsA.length; i++) {
		baseArr.push(i);
	};
	var allperms = permutator(baseArr);
	var alldistances = [];

	// Precompute all distance combinations from VertA to VertB first
	var precomputedDistances = [];

	for (var i = 0; i < vertsA.length; i++)
	{
		precomputedDistances.push([]);

		for (var j = 0; j < vertsB.length; j++)
		{
			precomputedDistances[i][j] = getDistance(vertsA[i], vertsB[j]);
		}
	}
	
	// Use precomputed distances instead of computing every iteration
	for (var i = 0; i < allperms.length; i++)
	{
		var perm = allperms[i];

		var distance = 0;
		for (var j = 0; j < vertsA.length; j++)
		{
			distance += precomputedDistances[j][perm[j]];
			//getDistance(vertsA[j], vertsB[perm[j]]);
		}
		
		alldistances.push({ dist: distance, index: i });
	}

	alldistances.sort(function(a, b) {
		return a.dist - b.dist;
	});

	var lowest = alldistances[0];
	var lowestsoln = allperms[lowest.index];

	console.log('lowest distance: ', lowest.dist);
	console.log('lowest index: ', lowest.index);
	console.log('lowest solution: ', lowestsoln);

	var newVertsB = [];
	for (var k = 0; k < lowestsoln.length; k++)
	{
		var newindex = lowestsoln[k];
		newVertsB.push(vertsB[newindex].clone());
	}

	// Copy newVertsB into vertsB
	for (var k = 0; k < vertsB.length; k++) {
		vertsB[k].copy(newVertsB[k]);
	}

}

module.exports = pairClosestPoints;