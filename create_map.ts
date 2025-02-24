import {pair, Pair} from './lib/list';

export type Cell = { cordinates: Pair<number, number> , property: String, biome: String};
export type Map = Array<Array<Cell>>;


export function create_map(size_x: number, size_y: number): Map {
    let my_map: Map = []
    for (let y = 0; y < size_y; y++) {
        my_map[y] = []
        for (let x = 0; x < size_x; x++) {
            my_map[y][x] = {cordinates: pair(x, y), property: "0", biome: "grass"}
        }
    }
    return my_map
}

