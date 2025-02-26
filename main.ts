import { 
    create_map, get_property, change_property
    , Cell, Coordinates, Map 
} from './maps';
import { pair, Pair, list } from './lib/list';
import { is_empty, empty, enqueue, dequeue, head} from './lib/queue_array';

import * as promptSync from 'prompt-sync';

const size_x = 5;
const size_y = 5;

function display_map(map: Map): void {
    for (let y = 0; y < map.length; y++) {
        let row = "";
        for (let x = 0; x < map[y].length; x++) {
            row += map[y][x].property + " ";
        }
        console.log(row);
    }
}
function adjacent_tiles([x, y]: Coordinates): Array<Coordinates> {
    const adjacent_tiles = [
        x + 1 < size_x ? pair(x + 1, y) : null,
        x - 1 >= 0     ? pair(x - 1, y) : null, 
        y + 1 < size_y ? pair(x, y + 1) : null, 
        y - 1 >= 0     ? pair(x, y - 1) : null, 
      ].filter(n => n !== null); //Kollar så att närliggande tiles är inom gränserna av spelet,
                                 //tar bort dem som ej är det(null).
    return adjacent_tiles;
}

//Räknar totala poängen på kartan. Hus ger ett poäng för varje närliggande hus (så ett ensamt hus ger 0 poäng).
function count_total_points(map: Map): number {
    let points = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x].property === "H") {
                points += count_points_house(map, pair(x, y));
            }
        }
    }
    return points;
}

function count_points_house(map: Map, [x, y]: Coordinates): number { //Räknar poäng genererat av ett specifikt hus
    const adjacent_cells = adjacent_tiles([x, y]);

    let neighbors = 0;
        for (let neighbor of adjacent_cells) {
            if (get_property(map, neighbor) === "H"){
                neighbors += 1;
            }
        }
    return neighbors;
}



function main(): void {
    let game_map = create_map(size_x, size_y);
    let game_running: boolean = true;
    let game_turn = 0;
    let game_points = 0;
            
    const prompt = promptSync();

    const building_queue = empty<string>(); //skapar en kö för byggnader att placera.
    for (let x = 0; x < 30; x++) {
        enqueue("House", building_queue); //detta kan vi ändra till något slumpgenererat.
    }



    while (game_running) {
        display_map(game_map);
        console.log(`Day: ${game_turn}`)
        console.log(`Points: ${game_points}`)
        console.log(" ");
        const current_building = head(building_queue);
        dequeue(building_queue);
        console.log(`Building to place: ${current_building} | Upcoming building: ${head(building_queue)}`);

        const user_coordinates = prompt('Enter coordinate of choosing: ');
        const [x, y] = user_coordinates.split(',').map(Number);
        if (x < 0 || y < 0 || x >= size_x || y >= size_y || isNaN(x) || isNaN(y)) {
            console.log(" *** Invalid coordinates, try again! *** ");
            continue;
        }
    
        
        
        change_property(game_map, pair(x, y), current_building[0].toUpperCase());


        console.log(`You have built a ${current_building} at coordinate ${user_coordinates}!`);
        game_points = count_total_points(game_map);

        game_turn += 1;
        console.log(`-----------------------------------------`) // För synlighet i terminalen mellan dagar(turns)
    }
}

main();