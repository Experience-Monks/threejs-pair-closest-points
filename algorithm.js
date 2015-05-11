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

	var allperms = permutator([0, 1, 2, 3, 4, 5]);
	var alldistances = [];

	for (var i = 0; i < allperms.length; i++)
	{
		var perm = allperms[i];

		var distance = 0;
		for (var j = 0; j < vertsA.length; j++)
		{
			distance += getDistance(vertsA[j], vertsB[perm[j]]);
		}
		
		//alldistances.push({ distance: distance, index: i });
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
		newVertsB.push(vertsB[newindex]);
	}

	// Copy newVertsB into vertsB
	for (var k = 0; k < vertsB.length; k++)
	{
		vertsB[k].x = newVertsB[k].x;
		vertsB[k].y = newVertsB[k].y;
		vertsB[k].z = newVertsB[k].z;
	}
}

module.exports = pairClosestPoints;