"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_map = create_map;
exports.change_property = change_property;
exports.change_biome = change_biome;
exports.get_property = get_property;
exports.get_biome = get_biome;
var list_1 = require("./lib/list");
function create_map(size_x, size_y) {
    var my_map = [];
    for (var y = 0; y < size_y; y++) {
        my_map[y] = [];
        for (var x = 0; x < size_x; x++) {
            if (Math.random() < 0.1) {
                my_map[y][x] = { cordinates: (0, list_1.pair)(x, y), property: "T", biome: "grass" };
            }
            else {
                my_map[y][x] = { cordinates: (0, list_1.pair)(x, y), property: "E", biome: "grass" };
            }
        }
    }
    return my_map;
}
function change_property(map, coords, property) {
    map[(0, list_1.tail)(coords)][(0, list_1.head)(coords)].property = property;
}
function change_biome(map, coords, biome) {
    map[(0, list_1.tail)(coords)][(0, list_1.head)(coords)].biome = biome;
}
function get_property(map, coords) {
    return map[(0, list_1.tail)(coords)][(0, list_1.head)(coords)].property;
}
function get_biome(map, coords) {
    return map[(0, list_1.tail)(coords)][(0, list_1.head)(coords)].biome;
}
