import {pair, Pair, tail, head} from './lib/list';

export type Cell = { cordinates: Pair<number, number> , property: String, biome: String};
export type Map = Array<Array<Cell>>;
export type Coordinates = Pair<number, number>;

/**
 * Creates a map of given size, cells have a 10% chance to contain a tree as property. Otherwise empty.
 * @param {number} size_x - Wanted horisontal size
 * @param {number} size_y - Wanted vertical size
 * @returns {Map} - The map
 * @precondition - size_x and size_y must be non-negative whole numbers.
 */
export function create_map(size_x: number, size_y: number): Map {
    let my_map: Map = []
    for (let y = 0; y < size_y; y++) {
        my_map[y] = []
        for (let x = 0; x < size_x; x++) {
            if (Math.random() < 0.1) {
                my_map[y][x] = {cordinates: pair(x, y), property: "T", biome: "grass"}
            }
            else {
            my_map[y][x] = {cordinates: pair(x, y), property: "E", biome: "grass"}
            }
        }  
    }
    return my_map
}

//Changes property of a cell
export function change_property(map: Map, coords: Coordinates, property: string): void {
    map[tail(coords)][head(coords)].property = property;
}
//Changes biome of a cell (biomes not implemented in the game yet).
export function change_biome(map: Map, coords: Coordinates, biome: string): void {
    map[tail(coords)][head(coords)].biome = biome;
}
//Returns property of a cell
export function get_property(map: Map, coords: Coordinates): String {
    return map[tail(coords)][head(coords)].property;
}
//Returns biome of a cell.
export function get_biome(map: Map, coords: Coordinates): String {
    return map[tail(coords)][head(coords)].biome;
}

