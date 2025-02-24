import { create_map, Cell, Map } from './create_map';
import { pair, Pair } from './lib/list';



function display_map(map: Map): void {
    for (let y = 0; y < map.length; y++) {
        let row = "";
        for (let x = 0; x < map[y].length; x++) {
            row += map[y][x].property + " ";
        }
        console.log(row);
    }
}

function main(): void {
    const size_x = 5;
    const size_y = 5;
    let my_map = create_map(size_x, size_y);
    let game_running: boolean = true;
    while (game_running) {
        display_map(my_map);
        break; //spelet här, inputs?
    }
}

main();