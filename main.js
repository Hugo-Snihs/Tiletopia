"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var maps_1 = require("./maps");
var list_1 = require("./lib/list");
var queue_array_1 = require("./lib/queue_array");
var promptSync = require("prompt-sync");
var size_x = 5;
var size_y = 5;
function display_map(map) {
    for (var y = 0; y < map.length; y++) {
        var row = "";
        for (var x = 0; x < map[y].length; x++) {
            row += map[y][x].property + " ";
        }
        console.log(row);
    }
}
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
function neighboring_tiles_including_roads(map //Lite buggig, tror den returnerar dubletter.
, _a, visited) {
    var x = _a[0], y = _a[1];
    var adjacent_tiles = neighboring_tiles(map, [x, y]);
    for (var i = 0; i < adjacent_tiles.length; i++) { //går igenom alla närliggande tiles och kollar om de är vägar.
        if ((0, maps_1.get_property)(map, adjacent_tiles[i]) === "R" && !visited.has(adjacent_tiles[i].toString())) { //är vägar och ej besökta än.
            visited.add(adjacent_tiles[i].toString());
            adjacent_tiles = Array.from(new Set(__spreadArray(__spreadArray([], adjacent_tiles, true), neighboring_tiles_including_roads(map, adjacent_tiles[i], visited), true))); //ett försök att "merga" två arrays och ta bort dubletter men tror kanske det är detta som inte funkar.
            //^^ Om tile A är granne med tile B, och tile B är en väg, så kommer tile A också vara granne med alla tiles som tile B är granne med.
        }
    }
    return adjacent_tiles;
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
function main() {
    var game_map = (0, maps_1.create_map)(size_x, size_y);
    var game_running = true;
    var game_turn = 0;
    var game_points = 0;
    var prompt = promptSync();
    var building_queue = (0, queue_array_1.empty)(); //skapar en kö för byggnader att placera.
    (0, queue_array_1.enqueue)("House", building_queue); //detta kan vi ändra till något slumpgenererat.
    (0, queue_array_1.enqueue)("Church", building_queue); // --||--
    (0, queue_array_1.enqueue)("Road", building_queue); // --||--
    (0, queue_array_1.enqueue)("Road", building_queue); // --||--
    for (var x = 0; x < 30; x++) {
        (0, queue_array_1.enqueue)("House", building_queue); // --||--
    }
    while (game_running) {
        display_map(game_map);
        console.log("Day: ".concat(game_turn));
        console.log("Points: ".concat(game_points));
        console.log(" ");
        var current_building = (0, queue_array_1.head)(building_queue);
        (0, queue_array_1.dequeue)(building_queue);
        console.log("Building to place: ".concat(current_building, " | Upcoming building: ").concat((0, queue_array_1.head)(building_queue)));
        var user_coordinates = prompt('Enter coordinate of choosing: ');
        var _a = user_coordinates.split(',').map(Number), x = _a[0], y = _a[1];
        if (x < 0 || y < 0 || x >= size_x || y >= size_y || isNaN(x) || isNaN(y)) {
            console.log(" *** Invalid coordinates, try again! *** ");
            continue;
        }
        (0, maps_1.change_property)(game_map, (0, list_1.pair)(x, y), current_building[0].toUpperCase());
        console.log("You have built a ".concat(current_building, " at coordinate ").concat(user_coordinates, "!"));
        game_points = count_total_points(game_map);
        game_turn += 1;
        console.log("-----------------------------------------"); // För synlighet i terminalen mellan dagar(turns)
    }
}
main();
