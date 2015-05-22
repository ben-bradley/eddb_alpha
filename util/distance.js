// http://math.stackexchange.com/questions/42640/calculate-distance-in-3d-space

/**
 * Calculate the square root of a number
 * @param   {Number} n The number for which to find a square root
 * @returns {Number} Returns the square root of n
 */
function sqrt(n) {
  return Math.sqrt(n);
}

/**
 * Calculate the absolute value of a number
 * @param   {Number} n The number for which to find an absolute value
 * @returns {Number} Returns the absolute value of n
 */
function abs(n) {
  return Math.abs(n);
}

/**
 * Squares a number
 * @param   {Number} n The number to square
 * @returns {Number} Returns the square of n
 */
function sq(n) {
  return n * n;
}

/**
 * Calculate the Pythagorean Theorem
 * @param   {Number} a The "a" in the formula
 * @param   {Number} b The "b" in the formula
 * @returns {Number} Returns the length of the hypotenuse
 */
function pt(a, b) {
  return sqrt(sq(a) + sq(b));
}

/**
 * Calculates the distance between points
 * @param   {Mixed}  a An array or an object with coordinates
 * @param   {Mixed}  b An array or an object with coordinates
 * @returns {Object} Returns an array or object with distances
 */
function distance(a, b) {
  var x, y, z;
  if (Array.isArray(a)) {
    x = abs(a[0] - b[0]);
    y = abs(a[1] - b[1]);
    z = abs(a[2] - b[2]);
  } else {
    x = abs(a.x - b.x),
    y = abs(a.y - b.y),
    z = abs(a.z - b.z);
  }
  return pt(pt(x, y), z);
}

module.exports = distance;
