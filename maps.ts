import {pair, Pair, tail, head} from './lib/list';

export type Cell = { cordinates: Pair<number, number> , property: String, biome: String};
export type Map = Array<Array<Cell>>;
export type Coordinates = Pair<number, number>;


export function create_map(size_x: number, size_y: number): Map {
    let my_map: Map = []
    for (let y = 0; y < size_y; y++) {
        my_map[y] = []
        for (let x = 0; x < size_x; x++) {
            my_map[y][x] = {cordinates: pair(x, y), property: "E", biome: "grass"}
        }
    }
    return my_map
}


function change_property(map: Map, coords: Coordinates, property: string): void {
    map[tail(coords)][head(coords)].property = property;
}
function change_biome(map: Map, coords: Coordinates, biome: string): void {
    map[tail(coords)][head(coords)].biome = biome;
}
function get_property(map: Map, coords: Coordinates): String {
    return map[tail(coords)][head(coords)].property;
}
function get_biome(map: Map, coords: Coordinates): String {
    return map[tail(coords)][head(coords)].biome;
}

