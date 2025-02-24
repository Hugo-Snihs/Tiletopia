import { create_map, Cell, Map, get_property, change_property} from './maps';
import { pair, Pair } from './lib/list';

import * as promptSync from 'prompt-sync';


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
            
    const prompt = promptSync();


    while (game_running) {
        display_map(my_map);

        const user_coordinates = prompt('Enter coordinate of choosing: ');
        const user_building = prompt('Enter your building of choosing: ');

        const [x, y] = user_coordinates.split(',').map(Number);

        change_property(my_map, pair(x, y), user_building[0].toUpperCase());

        console.log(`You have built a ${user_building} at coordinate ${user_coordinates}!`);
    }
}

main();