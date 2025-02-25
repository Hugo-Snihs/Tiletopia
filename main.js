"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maps_1 = require("./maps");
var list_1 = require("./lib/list");
var promptSync = require("prompt-sync");
function display_map(map) {
    for (var y = 0; y < map.length; y++) {
        var row = "";
        for (var x = 0; x < map[y].length; x++) {
            row += map[y][x].property + " ";
        }
        console.log(row);
    }
}
function main() {
    var size_x = 5;
    var size_y = 5;
    var game_map = (0, maps_1.create_map)(size_x, size_y);
    var game_running = true;
    var game_turn = 0;
    var game_points = 0;
    var prompt = promptSync();
    while (game_running) {
        display_map(game_map);
        console.log("Day: ".concat(game_turn));
        console.log("Points: ".concat(game_points));
        var user_coordinates = prompt('Enter coordinate of choosing: ');
        var user_building = prompt('Enter your building of choosing: ');
        var _a = user_coordinates.split(',').map(Number), x = _a[0], y = _a[1];
        if (x < 0 || y < 0 || x >= size_x || y >= size_y || isNaN(x) || isNaN(y)) {
            console.log(" *** Invalid coordinates, try again! *** ");
            continue;
        }
        if (isNaN(parseInt(user_building))) {
            console.log("bad type of building!");
            continue;
        }
        var adjacent_tiles = [
            x + 1 < size_x ? (0, list_1.pair)(x + 1, y) : null,
            x - 1 >= 0 ? (0, list_1.pair)(x - 1, y) : null,
            y + 1 < size_y ? (0, list_1.pair)(x, y + 1) : null,
            y - 1 >= 0 ? (0, list_1.pair)(x, y - 1) : null,
        ].filter(function (n) { return n !== null; }); //Kollar så att närliggande tiles är inom gränserna av spelet,
        //tar bort dem som ej är det(null).
        (0, maps_1.change_property)(game_map, (0, list_1.pair)(x, y), user_building[0].toUpperCase());
        var neighbors = 0;
        for (var _i = 0, adjacent_tiles_1 = adjacent_tiles; _i < adjacent_tiles_1.length; _i++) {
            var neighbor = adjacent_tiles_1[_i];
            if ((0, maps_1.get_property)(game_map, neighbor) === "H") {
                neighbors += 1;
            }
        }
        game_points += neighbors;
        console.log("You have built a ".concat(user_building, " at coordinate ").concat(user_coordinates, "!"));
        game_turn += 1;
        console.log("-----------------------------------------"); // För synlighet i terminalen mellan dagar(turns)
    }
}
main();
