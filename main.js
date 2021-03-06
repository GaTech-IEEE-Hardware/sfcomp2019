import {BCAbstractRobot, SPECS} from 'battlecode';

class MyRobot extends BCAbstractRobot {
    turn() {

        /*
        this.log("Orbs Map:")
        this.log(this.orbs_map);
        this.log(calc_x_grid(this.orbs_map)); // Test x sum functionality

        // Calculates centroid of initial map
        this.log("Centroid: " + [centroid_arr(calc_x_grid(this.orbs_map),0),centroid_arr(calc_y_grid(this.orbs_map),0)]);
        */
        var arr1 = calc_x_grid(this.orbs_map);
        var arr3 = calc_y_grid(this.orbs_map);
         var arr2 = partioner(3,arr1,arr1.reduce(getSum)/3);
         var arr4 = partioner(3,arr3,arr3.reduce(getSum)/3);
        // this.log(arr2); // Test x sum functionality
        var summer = 0;
        var summer1 = 0;
        this.log("Sum 1: " + arr2[0].reduce(getSum));
        this.log("Centroid 1: " + [centroid_arr(arr2[0], summer), centroid_arr(arr4[0], summer1)]);
        summer = summer + arr2[0].length;
        summer1 = summer1 + arr4[0].length;
        this.log("Sum 2: " + arr2[1].reduce(getSum));
        this.log("Centroid 2: " + [centroid_arr(arr2[1], summer), centroid_arr(arr4[1], summer1)]);
        summer = summer + arr2[1].length;
        summer1 = summer1 + arr4[1].length;
        this.log("Sum 2: " + arr2[2].reduce(getSum));
        this.log("Centroid 2: " + [centroid_arr(arr2[2], summer), centroid_arr(arr4[2], summer1)]);
        if (this.me.unit === SPECS.VOYAGER) {
            /* Choices
            0: Move Left
            1: Move Up
            2: Move Right
            3: Move Down
            */
            const choices = [[0,-1], [1, 0], [0, 1], [-1, 0]];
            var my_pos = [this.me.r, this.me.c];
            var first_centroid = [centroid_arr(calc_y_grid(this.orbs_map),0),centroid_arr(calc_x_grid(this.orbs_map),0)];

            // this.log("Begin: " + my_pos);
            // this.log("End: " + first_centroid);
            var newMap = this.map.map(function(arr) {
                return arr.slice();
            });

            var movY = findShortestPath(my_pos, first_centroid, newMap)[0][1];
            var movX = findShortestPath(my_pos, first_centroid, newMap)[2];
            //var movX = findShortestPath(my_pos, first_centroid, newMap)[0][1];
            // this.log("Move Y" + movY);
            // this.log("Move X" + movX);
            return this.move(movY,movX);


        }

        else if (this.me.unit === SPECS.PLANET) {
            const choices = [[0,-1], [1, 0], [0, 1], [-1, 0]];
            const choice = choices[Math.floor(Math.random()*choices.length)]
            if (this.orbs >= 65536) {
                this.log(choice);
                return this.buildUnit(choice[0], choice[1]);
            }
        }
    }
}

// Calculate optimal path from point a to b using BFS
// Start location will be in the following format:
// [distanceFromTop, distanceFromLeft]
var findShortestPath = function(startCoordinates, endCoord, grid) {
  var y = startCoordinates[0];
  var x = startCoordinates[1];

  // Each "location" will store its coordinates
  // and the shortest path required to arrive there
  var location = {
    distanceFromTop: y,
    distanceFromLeft: x,
    path: [],
    status: 'Start'
  };

  // Initialize the queue with the start location already inside
  var queue = [location];
  var it = 0;
  // Loop through the grid searching for the goal
  while (queue.length > 0) {
    it += 1;
    // Take the first location off the queue
    var currentLocation = queue.shift();

    // Explore North
    var newLocation = exploreInDirection(currentLocation, endCoord, [1, 0], grid);
    if (newLocation.status == 'Goal') {
      return newLocation.path;
    } else if (newLocation.status == 'Valid') {
      queue.push(newLocation);
    }


    // Explore East
    var newLocation = exploreInDirection(currentLocation, endCoord, [0,1], grid);
    if (newLocation.status == 'Goal') {
      return newLocation.path;
    } else if (newLocation.status == 'Valid') {
      queue.push(newLocation);
    }

    // Explore South
    var newLocation = exploreInDirection(currentLocation, endCoord, [-1, 0], grid);
    if (newLocation.status == 'Goal') {
      return newLocation.path;
    } else if (newLocation.status == 'Valid') {
      queue.push(newLocation);
    }

    // Explore West
    var newLocation = exploreInDirection(currentLocation, endCoord, [0, -1], grid);
    if (newLocation.status == 'Goal') {
      return newLocation.path;
    } else if (newLocation.status == 'Valid') {
      queue.push(newLocation);
    }
  }

  // No valid path found
  return false;

};

// This function will check a location's status
// (a location is "valid" if it is on the grid, is not an "obstacle",
// and has not yet been visited by our algorithm)
// Returns "Valid", "Invalid", "Blocked", or "Goal"
var locationStatus = function(location, endCoord, grid) {
  var gridSize = grid.length;
  var dft = location.distanceFromTop;
  var dfl = location.distanceFromLeft;

  if (location.distanceFromLeft < 0 ||
      location.distanceFromLeft >= gridSize ||
      location.distanceFromTop < 0 ||
      location.distanceFromTop >= gridSize) {

    // location is not on the grid--return false
    return 'Invalid';
  } else if (dft == endCoord[0] && dfl == endCoord[1]) {
    return 'Goal';
  } else if (grid[dft][dfl] == false || grid[dft][dfl] == 'Visited') {
    // location is either an obstacle or has been visited
    return 'Blocked';
  } else {
    return 'Valid';
  }
};


// Explores the grid from the given location in the given
// direction
var exploreInDirection = function(currentLocation, endCoord, direction, grid) {
  var newPath = currentLocation.path.slice();
  newPath.push(direction);

  var dft = currentLocation.distanceFromTop;
  var dfl = currentLocation.distanceFromLeft;

  if (direction[0] == 1 && direction[1] == 0) {
    dft -= 1;
  } else if (direction[0] == 0 && direction[1] == 1) {
    dfl += 1;
  } else if (direction[0] == -1 && direction[1] == 0) {
    dft += 1;
  } else if (direction[0] == 0 && direction[1] == -1) {
    dfl -= 1;
  }

  var newLocation = {
    distanceFromTop: dft,
    distanceFromLeft: dfl,
    path: newPath,
    status: 'Unknown'
  };
  newLocation.status = locationStatus(newLocation, endCoord, grid);

  // If this new location is valid, mark it as 'Visited'
  if (newLocation.status == 'Valid') {
    grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
  }

  return newLocation;
};




// Calculates manhattan distance between two points
function man_distance(a, b) {
    return;
}

// Calculate sum of each row to output a y value array
function calc_y_grid(ob_map) {
var sum_x = [];
    for (i = 0; i < ob_map.length; i++) {
        var sum = 0;
        for (j = 0; j < ob_map.length; j++) {
            sum = sum + ob_map[i][j];
        }
        sum_x.push(sum);
    }
    return sum_x;
}

// Calculate sum of each column to output a x value array
function calc_x_grid(ob_map) {
    var sum_x = [];
    for (i = 0; i < ob_map.length; i++) {
        var sum = 0;
        for (j = 0; j < ob_map.length; j++) {
            sum = sum + ob_map[j][i];
        }

        sum_x.push(sum);
    }
    return sum_x;
}

/* Calculates Centroid for an array
    arr: Array Input
    pos: Position of array in context

    returns: Position of centroid of 1d array
*/

function partioner(numVoyages, arr, mid) {
    var b = 0;
    var a = [];
    var sum = 0;
    var newarr = [];
    for (i = 0; i < arr.length; i++) {
        if ((sum + arr[i]) <= mid) {
            sum += arr[i];
            newarr.push(arr[i]); 
        } else {
            // console.log(newarr);
            a.push(newarr);
            newarr = [];
            b++;
            newarr.push(arr[i]);
            sum = arr[i];
        }
    }
    if (newarr != []) {
        // console.log(newarr);
        a.push(newarr);
        b++
    }
    if (b < numVoyages) {
        return partioner(numVoyages, arr, mid - 1);
    }
    if (b > numVoyages) {
        return partioner(numVoyages, arr, mid + 1);
    }
    return a;
}
function getSum(total, num) {
  return total + num;
}

function centroid_arr(arr, pos) {
    var cent = 0;
    var sum = 0;

    for (i = 0; i < arr.length; i++) {
        cent += (i+1) * arr[i];
        sum += arr[i];
    }

    return Math.round(cent / sum + pos);
}


var robot = new MyRobot();