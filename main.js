"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference lib="es2015" /> 
var maps_1 = require("./maps");
var list_1 = require("./lib/list");
var queue_array_1 = require("./lib/queue_array");
var promptSync = require("prompt-sync");
var size_x = 5;
var size_y = 5;
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
//hittar alla närliggande (ej diagonalt) tiles till en specifik tile. Räknar inte tiles utanför kartan. Returnerar en array med koordinaterna.
function neighboring_tiles(map, _a) {
    var x = _a[0], y = _a[1];
    var adjacent_tiles = [
        x + 1 < size_x ? (0, list_1.pair)(x + 1, y) : null,
        x - 1 >= 0 ? (0, list_1.pair)(x - 1, y) : null,
        y + 1 < size_y ? (0, list_1.pair)(x, y + 1) : null,
        y - 1 >= 0 ? (0, list_1.pair)(x, y - 1) : null,
    ].filter(function (n) { return n !== null; }); //Kollar så att närliggande tiles är inom gränserna av spelet,
    //tar bort dem som ej är det(null).
    return adjacent_tiles;
}
//Samma som neighboring_tiles men räknar även tiles som är sammankopplade med vägar (och vägarna själva).
function neighboring_tiles_including_roads(map, _a, visited) {
    var x = _a[0], y = _a[1];
    var adjacent_tiles = neighboring_tiles(map, [x, y]);
    for (var i = 0; i < adjacent_tiles.length; i++) { //går igenom alla närliggande tiles och kollar om de är vägar.
        if ((0, maps_1.get_property)(map, adjacent_tiles[i]) === "R"
            && !visited.has(adjacent_tiles[i].toString())) { //är vägar och ej besökta än.
            visited.add(adjacent_tiles[i].toString());
            adjacent_tiles = merge_arrays(adjacent_tiles, neighboring_tiles_including_roads(map, adjacent_tiles[i], visited));
            //^^ Om tile A är granne med tile B, och tile B är en väg, så kommer tile A också vara granne med alla tiles som tile B är granne med.
        }
    }
    return adjacent_tiles;
}
//Sätter ihop två arrays och tar bort dubletter. Ordningen spelar ingen roll.
function merge_arrays(arr1, arr2) {
    var length1 = arr1.length;
    var length2 = arr2.length;
    for (var i = 0; i < length1; i++) { //Tar bort dubletter
        for (var j = 0; j < length2; j++) {
            if (arr1[i].toString() === arr2[j].toString()) {
                arr2[j] = (0, list_1.pair)(-1, -1); //gör dubletter till en ogiltig koordinat i arr2
            }
        }
    }
    for (var i = 0; i < length2; i++) { //Lägger till giltiga element från arr2 till arr1
        if (arr2[i].toString() !== (0, list_1.pair)(-1, -1).toString()) {
            arr1.push(arr2[i]);
        }
    }
    return arr1;
}
//Räknar totala poängen på kartan. Hus ger ett poäng för varje närliggande hus (så ett ensamt hus ger 0 poäng).
function count_total_points(map) {
    var points = 0;
    for (var y = 0; y < map.length; y++) {
        for (var x = 0; x < map[y].length; x++) { //nested loops, går igenom varje tile i kartan och räknar poängen.
            var current_property = (0, maps_1.get_property)(map, (0, list_1.pair)(x, y));
            if (current_property === "H") {
                points += count_points_house(map, (0, list_1.pair)(x, y));
            }
            else if (current_property === "C") {
                points += count_points_church(map, (0, list_1.pair)(x, y));
            }
            //Här kan vi lägga till fler else-if för fler eventuella byggnader som ger poäng.
        }
    }
    return points;
}
function count_points_church(map, _a) {
    var x = _a[0], y = _a[1];
    var adjacent_cells = neighboring_tiles_including_roads(map, [x, y], new Set());
    var neighbors = 0;
    for (var _i = 0, adjacent_cells_1 = adjacent_cells; _i < adjacent_cells_1.length; _i++) {
        var neighbor = adjacent_cells_1[_i];
        if ((0, maps_1.get_property)(map, neighbor) === "H") {
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
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
//Skapar en kö med byggnader som spelaren kan placera ut. Vi kan implementera en slumpgenererad kö här istället.
function create_building_queue(items) {
    var building_queue = (0, queue_array_1.empty)();
    for (var i = 0; i < items; i++) {
        (0, queue_array_1.enqueue)(buildings[getRandomInt(buildings.length)], building_queue);
    }
    return building_queue;
}
//Returnerar True om byggnaden placerats, False om inte.
function place(map, coordinates, building) {
    if (building === "Lumberjack") {
        if ((0, maps_1.get_property)(map, coordinates) === "T") { //T för tree
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
function main() {
    var game_map = (0, maps_1.create_map)(size_x, size_y);
    var game_running = true;
    var game_turn = 0;
    var game_points = 0;
    var prompt = promptSync();
    var building_queue = create_building_queue(3);
    while (game_running) {
        console.log(" ");
        display_map(game_map);
        console.log("Day: ".concat(game_turn));
        console.log("Points: ".concat(game_points));
        console.log(" ");
        var current_building = (0, queue_array_1.head)(building_queue);
        console.log("Building to place: ".concat(current_building, " | Upcoming building: ").concat((0, queue_array_1.head)(building_queue)));
        var user_coordinates = prompt('Enter coordinate of choosing: ');
        var _a = user_coordinates.split(',').map(Number), x = _a[0], y = _a[1];
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
        console.log("-----------------------------------------"); // För synlighet i terminalen mellan dagar(turns)
    }
}
main();
