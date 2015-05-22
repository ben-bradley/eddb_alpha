let a = [ 1,  1,  1],
    b = [20, 21, 33];

let d = [
  Math.abs(a[0] - b[0]),
  Math.abs(a[1] - b[1]),
  Math.abs(a[2] - b[2])
];

let distance = require('./distance'),
  dist = distance(a, b);

while (dist > 5) { // while the distance is greater than the max
  d[0] = d[0] / 2;
  d[1] = d[1] / 2;
  d[2] = d[2] / 2;
  dist = distance(a, d);
  console.log(d, dist);
}

console.log(d);
