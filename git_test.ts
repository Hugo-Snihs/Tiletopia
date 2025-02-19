import {pair, Pair} from 'list';

type Cell = { cordinates: Pair<number, number> , property: String, biome: String};
type Map = Array<Array<Cell>>;



const size_x = 5;
const size_y = 5;

function create_map(x, y) {
    let my_map: Map = []
    for (let y = 0; y < size_y; y++) {
        my_map[y] = []
        for (let x = 0; x < size_x; x++) {
            my_map[y][x] = {cordinates: pair(x, y), property: "empty", biome: "grass"}
        }
    }
    return my_map
}