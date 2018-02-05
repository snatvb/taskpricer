/**
 * Created by snatvb on 05.02.2018.
 */

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
}

function getFactors(maxRatio, middleRatio) {
  let factors = new Array(maxRatio + 1);
  factors[ 0 ] = 0;
  const step = (middleRatio / (middleRatio + 1));
  const mr = middleRatio + 1;
  for (let i = 1; i < factors.length; i++) {
    if (i < middleRatio) {
      factors[ i ] = middleRatio - step * i;
    } else {
      factors[ i ] = middleRatio + step * (i - middleRatio);
    }
  }
  return factors.sort((a, b) => a - b);
}

function middleNumber(array, cb) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    const item = array[ i ];
    sum += cb ? cb(item, i, array) : item;
  }
  return sum / array.length;
}

module.exports = {
  randomInteger,
  getFactors,
  middleNumber,
};