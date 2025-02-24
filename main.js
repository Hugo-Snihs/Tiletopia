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
    var my_map = (0, maps_1.create_map)(size_x, size_y);
    var game_running = true;
    var prompt = promptSync();
    while (game_running) {
        display_map(my_map);
        var user_coordinates = prompt('Enter coordinate of choosing: ');
        var user_building = prompt('Enter your building of choosing: ');
        var _a = user_coordinates.split(',').map(Number), x = _a[0], y = _a[1];
        (0, maps_1.change_property)(my_map, (0, list_1.pair)(x, y), user_building[0].toUpperCase());
        console.log("You have built a ".concat(user_building, " at coordinate ").concat(user_coordinates, "!"));
    }
}
main();
