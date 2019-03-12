/**
 * Created by snatvb on 05.02.2018.
 */
const { getFactors } = require('./utils');

const maxRatio = 9;
const middleRatio = (maxRatio - 1) / 2;
if (middleRatio !== middleRatio ^ 0) {
  throw Error(`middle ratio is not integer`);
}

const factors = getFactors(maxRatio, middleRatio);
const totalPrice = parseInt(process.argv[3] || 90000, 10);
const baseDir = process.cwd();

module.exports = {
  maxRatio,
  middleRatio,
  factors,
  totalPrice,
  baseDir
};