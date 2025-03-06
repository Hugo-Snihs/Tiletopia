"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.count_total_points = count_total_points;
exports.spawn_barbarian = spawn_barbarian;
exports.is_protected_by_fortress = is_protected_by_fortress;
exports.spread_barbarian = spread_barbarian;
exports.upgrade_to_fortress = upgrade_to_fortress;
exports.place = place;
/// <reference lib="es2015" /> 
var maps_1 = require("./maps");
var list_1 = require("./lib/list");
var queue_array_1 = require("./lib/queue_array");
var promptSync = require("prompt-sync");
var size_x = 7;
var size_y = 7;
var buildings = ["House", "Church", "Road", "Lumberjack"];
function display_map(map) {
    for (var y = 0; y < map.length; y++) {
        var row = "";
        for (var x = 0; x < map[y].length; x++) {
            row += map[y][x].property + " ";
        }
        console.log(row);
    }
}
/**
 * Finds orthogonally adjacent (not diagonally adjacent) cells of a given cell.
 * @param {Map} map - The map
 * @param {Coordinates} [x,y] - The coordinates of the given cell.
 * @returns {Array<Coordinates>} - An array of the adjacent coordinates (normally 4 coordinates, 3 if given cell is an edge and 2 if its a corner).
 * @complexity - Theta(1)
 */
function neighboring_tiles(map, _a) {
    var x = _a[0], y = _a[1];
    var adjacent_tiles = [
        x + 1 < size_x ? (0, list_1.pair)(x + 1, y) : null,
        x - 1 >= 0 ? (0, list_1.pair)(x - 1, y) : null,
        y + 1 < size_y ? (0, list_1.pair)(x, y + 1) : null,
        y - 1 >= 0 ? (0, list_1.pair)(x, y - 1) : null,
    ].filter(function (n) { return n !== null; }); //Removes cells outside of borders.
    return adjacent_tiles;
}
/**
 * Same as neighbouring_tiles but counts tiles connected by roads (and the roads) as adjacent. Operates recurively, similar to DFS search.
 * @param {Map} map - The map
 * @param {Coordinates} [x,y] - The coordinates of the given cell.
 * @returns {Array<Coordinates>} - An array of the adjacent coordinates.
 * @complexity - O(size_x * size_y), worst case, if all tiles in the map are roads.
 */
function neighboring_tiles_including_roads(map, _a, visited) {
    var x = _a[0], y = _a[1];
    var adjacent_tiles = neighboring_tiles(map, [x, y]);
    for (var i = 0; i < adjacent_tiles.length; i++) { //går igenom alla närliggande tiles och kollar om de är vägar.
        if ((0, maps_1.get_property)(map, adjacent_tiles[i]) === "R"
            && !visited.has(adjacent_tiles[i].toString())) { //är vägar och ej besökta än.
            visited.add(adjacent_tiles[i].toString());
            adjacent_tiles = merge_arrays(adjacent_tiles, neighboring_tiles_including_roads(map, adjacent_tiles[i], visited));
        }
    }
    return adjacent_tiles;
}
//Merges two arrays of coordinates and removes duplicates, output array is in no particular order.
function merge_arrays(arr1, arr2) {
    var length1 = arr1.length;
    var length2 = arr2.length;
    for (var i = 0; i < length1; i++) { //removes duplicates
        for (var j = 0; j < length2; j++) {
            if (arr1[i].toString() === arr2[j].toString()) {
                arr2[j] = (0, list_1.pair)(-1, -1); //Sets duplicates to an unvalid coordinate.
            }
        }
    }
    for (var i = 0; i < length2; i++) { //Adds valid coordinates from arr2 to arr1
        if (arr2[i].toString() !== (0, list_1.pair)(-1, -1).toString()) {
            arr1.push(arr2[i]);
        }
    }
    return arr1;
}
/**
 * Counts total score on a map
 * @param {Map} map - The map to count score for.
 * @returns {number} - The score.
 * @complexity O(n^2) where n is number of cells. This is worst case if map is filled with churches and roads. Normally it's Theta(n)
 */
function count_total_points(map) {
    var points = 0;
    for (var y = 0; y < map.length; y++) {
        for (var x = 0; x < map[y].length; x++) { //nested loops, goes through the map and counts the points on each cell.
            var current_property = (0, maps_1.get_property)(map, (0, list_1.pair)(x, y));
            if (current_property === "H") {
                points += count_points_house(map, (0, list_1.pair)(x, y));
            }
            else if (current_property === "C") {
                points += count_points_church(map, (0, list_1.pair)(x, y));
            }
            else if (current_property === "F") {
                points += count_points_fortress(map, (0, list_1.pair)(x, y));
            }
            //Add more else-if statements here if we want more buildings that gives points.
        }
    }
    return points;
}
//Counts points given by a specific church. Gives one point for each adjacent house or fortress (adjacent through roads count).
function count_points_church(map, _a) {
    var x = _a[0], y = _a[1];
    var adjacent_cells = neighboring_tiles_including_roads(map, [x, y], new Set());
    var neighbors = 0;
    for (var _i = 0, adjacent_cells_1 = adjacent_cells; _i < adjacent_cells_1.length; _i++) {
        var neighbor = adjacent_cells_1[_i];
        if ((0, maps_1.get_property)(map, neighbor) === "H" || (0, maps_1.get_property)(map, neighbor) === "F") {
            neighbors += 1;
        }
    }
    var points = neighbors;
    return points;
}
function count_points_house(map, _a) {
    var x = _a[0], y = _a[1];
    return 1;
}
function count_points_fortress(map, _a) {
    var x = _a[0], y = _a[1];
    return -2;
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function create_building_queue(items) {
    var building_queue = (0, queue_array_1.empty)();
    for (var i = 0; i < items; i++) {
        (0, queue_array_1.enqueue)(buildings[getRandomInt(buildings.length)], building_queue);
    }
    return building_queue;
}
function spawn_barbarian(map) {
    var empty_tiles = [];
    for (var y = 0; y < map.length; y++) {
        for (var x = 0; x < map[y].length; x++) {
            if ((0, maps_1.get_property)(map, (0, list_1.pair)(x, y)) === "E") {
                empty_tiles.push((0, list_1.pair)(x, y));
            }
        }
    }
    if (empty_tiles.length > 0) {
        var spawn_point = empty_tiles[getRandomInt(empty_tiles.length)];
        (0, maps_1.change_property)(map, spawn_point, "B");
        console.log("A barbarian has appeared at ".concat(spawn_point, "!"));
    }
}
function is_protected_by_fortress(map, coordinates) {
    var adjacent_tiles = neighboring_tiles(map, coordinates);
    for (var _i = 0, adjacent_tiles_1 = adjacent_tiles; _i < adjacent_tiles_1.length; _i++) {
        var adj = adjacent_tiles_1[_i];
        if ((0, maps_1.get_property)(map, adj) === "F") {
            return true;
        }
    }
    return false;
}
function spread_barbarian(map) {
    var new_barbarians = [];
    for (var y = 0; y < map.length; y++) {
        for (var x = 0; x < map[y].length; x++) {
            if ((0, maps_1.get_property)(map, (0, list_1.pair)(x, y)) === "B") {
                var adjacent_tiles = neighboring_tiles(map, (0, list_1.pair)(x, y));
                if (adjacent_tiles.length > 0) {
                    var random_tile = adjacent_tiles[getRandomInt(adjacent_tiles.length)];
                    var property = (0, maps_1.get_property)(map, random_tile);
                    if ((property === "E" || property === "H" || property === "C")
                        && !is_protected_by_fortress(map, random_tile)) {
                        new_barbarians.push(random_tile);
                    }
                }
            }
        }
    }
    for (var _i = 0, new_barbarians_1 = new_barbarians; _i < new_barbarians_1.length; _i++) {
        var tile = new_barbarians_1[_i];
        (0, maps_1.change_property)(map, tile, "B");
    }
    if (new_barbarians.length > 0) {
        console.log("The barbarians have taken new territory!");
    }
}
function clear_adjacent_barbarians(map, coordinates) {
    var adjacent_tiles = neighboring_tiles(map, coordinates);
    for (var _i = 0, adjacent_tiles_2 = adjacent_tiles; _i < adjacent_tiles_2.length; _i++) {
        var adj = adjacent_tiles_2[_i];
        if ((0, maps_1.get_property)(map, adj) === "B") {
            (0, maps_1.change_property)(map, adj, "E");
        }
    }
}
function upgrade_to_fortress(map, coordinates, game_points) {
    if (game_points < 3) {
        console.log(" *** You have insufficient points to build a fortress! (3 points required) *** ");
        return game_points;
    }
    if ((0, maps_1.get_property)(map, coordinates) === "H") {
        (0, maps_1.change_property)(map, coordinates, "F"); //Konverterar house till fortress
        clear_adjacent_barbarians(map, coordinates);
        console.log("You have built a Fortress at ".concat(coordinates, "! The surrounding barbarians are repelled."));
        return game_points - 3;
    }
    else {
        console.log(" *** You can only upgrade a house to a fortress! *** ");
        return game_points;
    }
}
/**
 * Places (if possible) a building on a cell.
 * @param {Map} map - The map to place on.
 * @param {Coordintaes} coordinates - The coordinates to place building on.
 * @param {str} building - The building to place.
 * @returns {boolean} - True if placement went through, false otherwise.
 * @precondition - Str must be a valid building in the game.
 * @complexity Theta(1)
 */
function place(map, coordinates, building) {
    if (building === "Lumberjack") {
        if ((0, maps_1.get_property)(map, coordinates) === "T") {
            (0, maps_1.change_property)(map, coordinates, "E");
            console.log("You used a lumberjack to remove trees at coordinates ".concat(coordinates, "!"));
            return true;
        }
        if ((0, maps_1.get_property)(map, coordinates) === "E") {
            console.log("You gave the lumberjack a day off.");
            return true;
        }
        else {
            console.log(" *** Non-empty tile. Try again. *** ");
            return false;
        }
    }
    if ((0, maps_1.get_property)(map, coordinates) === "E") {
        (0, maps_1.change_property)(map, coordinates, building[0].toUpperCase());
        console.log("You have built a ".concat(building, " at coordinates ").concat(coordinates, "!"));
        return true;
    }
    else {
        console.log(" *** Non-empty tile. Try again. *** ");
        return false;
    }
}
/**
 * The main function containing the user input loop. Creates a map, counts points, handles player inputs.
 */
function main() {
    var game_map = (0, maps_1.create_map)(size_x, size_y);
    var game_running = true;
    var game_turn = 0;
    var game_points = 0;
    var prompt = promptSync();
    var building_queue = create_building_queue(3);
    spawn_barbarian(game_map);
    while (game_running) {
        console.log(" ");
        display_map(game_map);
        console.log("Day: ".concat(game_turn));
        console.log("Points: ".concat(game_points));
        console.log(" ");
        var current_building = (0, queue_array_1.head)(building_queue);
        console.log("Building to place: ".concat(current_building));
        var user_choice = prompt("Do you want to (1) place a building or (2) upgrade a house to a fortress?");
        if (user_choice !== "1" && user_choice !== "2") { // Kan ej CTRL + C avsluta här av någon anledning... välj 1/2 sen avsluta isf.
            console.log(" *** Invalid choice! *** ");
            continue;
        }
        if (user_choice === "2") { // Väljer att uppgradera hus till Fortress.
            var user_coordinates_1 = prompt('Enter coordinate of house: ');
            var _a = user_coordinates_1.split(',').map(Number), x_1 = _a[0], y_1 = _a[1];
            if (x_1 < 0 || y_1 < 0 || x_1 >= size_x || y_1 >= size_y || isNaN(x_1) || isNaN(y_1)) {
                console.log(" *** Invalid coordinates, try again! *** ");
                continue;
            }
            var new_game_points = upgrade_to_fortress(game_map, (0, list_1.pair)(x_1, y_1), game_points);
            if (new_game_points !== game_points) { //Om man har 3 poäng
                game_points = new_game_points;
                continue; // Hoppa över att välja från building queue
            }
            else {
                continue; // Uppgradering misslyckas
            }
        }
        var user_coordinates = prompt('Enter coordinate of choosing: ');
        var _b = user_coordinates.split(',').map(Number), x = _b[0], y = _b[1];
        if (x < 0 || y < 0 || x >= size_x || y >= size_y || isNaN(x) || isNaN(y)) {
            console.log(" *** Invalid coordinates, try again! *** ");
            continue;
        }
        if (!place(game_map, (0, list_1.pair)(x, y), current_building)) {
            continue;
        }
        game_points = count_total_points(game_map);
        (0, queue_array_1.dequeue)(building_queue);
        game_turn += 1;
        (0, queue_array_1.enqueue)(buildings[getRandomInt(buildings.length)], building_queue);
        spread_barbarian(game_map);
        //console.log(`-----------------------------------------`) // För synlighet i terminalen mellan dagar(turns)
    }
}
//main();
