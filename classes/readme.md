# Classes!

## Data

> Both `Systems` and `Stations` extend the Data class

### Methods

#### `data.findById(id)`

Wraps Lodash `findWhere()` with the `id` property;

#### `data.findByName(name)`

Wraps Lodash `findWhere()` with the `name` property;

#### `data.find(kv)`

Wraps Lodash `findWhere()`;

#### `data.filter(cb)`

Filters the data set based on `cb()`

## Systems

```es6
let Systems = require('./systems');

let systems = new Systems();
```

### Methods

#### `systems.adjacent(system, distance)`

```es6
// Returns an array of systems that are within `distance` Ly
let adjacencies = systems.adjacent(system, 10);
```

## Stations

```es6
let Stations = require('./stations');

let stations = new Stations();
```

### Methods

#### `stations.inSystem(system)`

```es6
// solstations.js
let sol = systems.findByName('sol');

let solStations = stations.inSystem(sol);

solStations.forEach(station => {
  console.log(station.name);
});
```

```shell
$ iojs ./solstations
Abraham Lincoln
Galileo
Li Qing Jao
M.Gorbachev
Daedalus
Mars High
Columbus
Titan City
Burnell Station
```
