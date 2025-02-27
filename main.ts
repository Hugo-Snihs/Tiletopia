/// <reference lib="es2015" /> 
import { 
    create_map, get_property, change_property
    , Cell, Coordinates, Map 
} from './maps';
import { pair, Pair, list, list_ref } from './lib/list';
import { is_empty, empty, enqueue, dequeue, head, Queue} from './lib/queue_array';

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
//hittar alla närliggande (ej diagonalt) tiles till en specifik tile. Räknar inte tiles utanför kartan. Returnerar en array med koordinaterna.
function neighboring_tiles(map: Map, [x, y]: Coordinates): Array<Coordinates> {
    let adjacent_tiles = [
        x + 1 < size_x ? pair(x + 1, y) : null,
        x - 1 >= 0     ? pair(x - 1, y) : null, 
        y + 1 < size_y ? pair(x, y + 1) : null, 
        y - 1 >= 0     ? pair(x, y - 1) : null, 
      ].filter(n => n !== null); //Kollar så att närliggande tiles är inom gränserna av spelet,
                                 //tar bort dem som ej är det(null).
    return adjacent_tiles; 
}

//Samma som neighboring_tiles men räknar även tiles som är sammankopplade med vägar (och vägarna själva).
function neighboring_tiles_including_roads(map: Map 
                                            , [x, y]: Coordinates
                                            , visited: Set<String>): Array<Coordinates> {
    let adjacent_tiles = neighboring_tiles(map, [x, y]);
    for (let i = 0; i < adjacent_tiles.length; i++) { //går igenom alla närliggande tiles och kollar om de är vägar.
        if (get_property(map, adjacent_tiles[i])  === "R" 
            && !visited.has(adjacent_tiles[i].toString())) { //är vägar och ej besökta än.
                visited.add(adjacent_tiles[i].toString());
                adjacent_tiles = merge_arrays(adjacent_tiles
                                            , neighboring_tiles_including_roads(
                                                map
                                                , adjacent_tiles[i]
                                                , visited)); 
//^^ Om tile A är granne med tile B, och tile B är en väg, så kommer tile A också vara granne med alla tiles som tile B är granne med.
        }
    } 
    return adjacent_tiles; 
}

//Sätter ihop två arrays och tar bort dubletter. Ordningen spelar ingen roll.
function merge_arrays(arr1: Array<Coordinates>, arr2: Array<Coordinates>): Array<Coordinates> {
    const length1 = arr1.length;
    const length2 = arr2.length;
    for (let i = 0; i < length1; i++) { //Tar bort dubletter
        for (let j = 0; j < length2; j++) {
            if (arr1[i].toString() === arr2[j].toString()) {
                arr2[j] = pair(-1, -1); //gör dubletter till en ogiltig koordinat i arr2
            }
        }
    }
    for (let i = 0; i < length2; i++) { //Lägger till giltiga element från arr2 till arr1
        if (arr2[i].toString() !== pair(-1, -1).toString()) {
        arr1.push(arr2[i]);
        }
    }
    return arr1;
}



    //Räknar totala poängen på kartan. Hus ger ett poäng för varje närliggande hus (så ett ensamt hus ger 0 poäng).
function count_total_points(map: Map): number {
    let points = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) { //nested loops, går igenom varje tile i kartan och räknar poängen.
            const current_property = get_property(map, pair(x, y));
            if (current_property === "H") {
                points += count_points_house(map, pair(x, y));
            }
            else if (current_property === "C") {
                points += count_points_church(map, pair(x, y));
            }
            //Här kan vi lägga till fler else-if för fler eventuella byggnader som ger poäng.
        }
    }
    return points;
}

function count_points_church(map: Map, [x, y]: Coordinates): number { //Räknar poäng genererat av en specifik kyrka.
    const adjacent_cells = neighboring_tiles_including_roads(map, [x, y], new Set());
    let neighbors = 0;
        for (let neighbor of adjacent_cells) {
            if (get_property(map, neighbor) === "H"){
                neighbors += 1;
            }
        }
    const points = neighbors;
    return points;
}
function count_points_house(map: Map, [x, y]: Coordinates): number { //Hus ger ett poäng styck.
    return 1;
}

//Skapar en kö med byggnader som spelaren kan placera ut. Vi kan implementera en slumpgenererad kö här istället.
function create_building_queue(): Queue<string> {
    const building_queue = empty<string>(); 
    enqueue("House", building_queue); 
    enqueue("Church", building_queue); 
    enqueue("Road", building_queue); 
    enqueue("Road", building_queue);        
    for (let x = 0; x < 30; x++) {
        enqueue("House", building_queue);
    }
    return building_queue;
}

function main(): void {
    let game_map = create_map(size_x, size_y);
    let game_running: boolean = true;
    let game_turn = 0;
    let game_points = 0;
            
    const prompt = promptSync();

    const building_queue = create_building_queue();


    while (game_running) {
        console.log(" ");
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