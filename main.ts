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
    let game_map = create_map(size_x, size_y);
    let game_running: boolean = true;
    let game_turn = 0;
    let game_points = 0;
            
    const prompt = promptSync();


    while (game_running) {
        display_map(game_map);
        console.log(`Day: ${game_turn}`)
        console.log(`Points: ${game_points}`)

        const user_coordinates = prompt('Enter coordinate of choosing: ');
        const user_building = prompt('Enter your building of choosing: ');

        const [x, y] = user_coordinates.split(',').map(Number);

        if (x < 0 || y < 0 || x >= size_x || y >= size_y || isNaN(x) || isNaN(y)) {
            console.log(" *** Invalid coordinates, try again! *** ");
            continue;
        }
        
        const adjacent_tiles = [
                            x + 1 < size_x ? pair(x + 1, y) : null,
                            x - 1 >= 0     ? pair(x - 1, y) : null, 
                            y + 1 < size_y ? pair(x, y + 1) : null, 
                            y - 1 >= 0     ? pair(x, y - 1) : null, 
                          ].filter(n => n !== null); //Kollar så att närliggande tiles är inom gränserna av spelet,
                                                     //tar bort dem som ej är det(null).

        change_property(game_map, pair(x, y), user_building[0].toUpperCase());

        let neighbors = 0;
        for (let neighbor of adjacent_tiles) {
            if (get_property(game_map, neighbor) === "H"){
                neighbors += 1;
            }
        }

        game_points += neighbors;

        console.log(`You have built a ${user_building} at coordinate ${user_coordinates}!`);

        game_turn += 1;
        console.log(`-----------------------------------------`) // För synlighet i terminalen mellan dagar(turns)
    }
}

main();