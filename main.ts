/// <reference lib="es2015" /> 
import { 
    create_map, get_property, change_property
    , Cell, Coordinates, Map 
} from './maps';
import { pair, Pair, list, list_ref, List } from './lib/list';
import { is_empty, empty, enqueue, dequeue, head, Queue} from './lib/queue_array';

import * as promptSync from 'prompt-sync';

const size_x: number = 7;
const size_y: number = 7;
const buildings: Array<string> = ["House", "Church", "Road", "Lumberjack"];

function display_map(map: Map): void {
    for (let y = 0; y < map.length; y++) {
        let row = "";
        for (let x = 0; x < map[y].length; x++) {
            row += map[y][x].property + " ";
        }
        console.log(row);
    }
}
/**
 * Finds orthogonally adjacent (not diagonally adjacent) cells of a given cell.
 * @param {Map} map - The map
 * @param {Coordinates} [x,y] - The coordinates of the given cell.
 * @returns {Array<Coordinates>} - An array of the adjacent coordinates (normally 4 coordinates, 3 if given cell is an edge and 2 if its a corner).
 * @complexity - Theta(1)
 */
function neighboring_tiles(map: Map, [x, y]: Coordinates): Array<Coordinates> {
    let adjacent_tiles: Array<Coordinates> = [
        x + 1 < size_x ? pair(x + 1, y) : null,
        x - 1 >= 0     ? pair(x - 1, y) : null, 
        y + 1 < size_y ? pair(x, y + 1) : null, 
        y - 1 >= 0     ? pair(x, y - 1) : null, 
      ].filter(n => n !== null); //Removes cells outside of borders.
                                 
    return adjacent_tiles; 
}

/**
 * Same as neighbouring_tiles but counts tiles connected by roads (and the roads) as adjacent. Operates recurively, similar to DFS search.
 * @param {Map} map - The map
 * @param {Coordinates} [x,y] - The coordinates of the given cell.
 * @returns {Array<Coordinates>} - An array of the adjacent coordinates.
 * @complexity - O(size_x * size_y), worst case, if all tiles in the map are roads.
 */
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

        }
    } 
    return adjacent_tiles; 
}

//Merges two arrays of coordinates and removes duplicates, output array is in no particular order.
function merge_arrays(arr1: Array<Coordinates>, arr2: Array<Coordinates>): Array<Coordinates> {
    const length1: number = arr1.length;
    const length2: number = arr2.length;
    for (let i = 0; i < length1; i++) { //removes duplicates
        for (let j = 0; j < length2; j++) {
            if (arr1[i].toString() === arr2[j].toString()) {
                arr2[j] = pair(-1, -1); //Sets duplicates to an unvalid coordinate.
            }
        }
    }
    for (let i = 0; i < length2; i++) { //Adds valid coordinates from arr2 to arr1
        if (arr2[i].toString() !== pair(-1, -1).toString()) {
        arr1.push(arr2[i]);
        }
    }
    return arr1;
}



    /**
     * Counts total score on a map
     * @param {Map} map - The map to count score for.
     * @returns {number} - The score.
     * @complexity O(n^2) where n is number of cells. This is worst case if map is filled with churches and roads. Normally it's Theta(n) 
     */
export function count_total_points(map: Map): number {
    let points: number = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) { //nested loops, goes through the map and counts the points on each cell.
            const current_property = get_property(map, pair(x, y));
            if (current_property === "H") {
                points += count_points_house(map, pair(x, y));
            }
            else if (current_property === "C") {
                points += count_points_church(map, pair(x, y));
            }
            else if (current_property === "F") {
                points += count_points_fortress(map, pair(x, y));
            }
            //Add more else-if statements here if we want more buildings that gives points.
        }
    }
    return points;
}

//Counts points given by a specific church. Gives one point for each adjacent house or fortress (adjacent through roads count).
function count_points_church(map: Map, [x, y]: Coordinates): number { 
    const adjacent_cells: Array<Coordinates> = neighboring_tiles_including_roads(map, [x, y], new Set());
    let neighbors: number = 0;
        for (let neighbor of adjacent_cells) {
            if (get_property(map, neighbor) === "H" ||get_property(map, neighbor) === "F" ){
                neighbors += 1;
            }
        }
    const points: number = neighbors;
    return points;
}
function count_points_house(map: Map, [x, y]: Coordinates): number { //Counts points given by a house.
    return 1;
}
function count_points_fortress(map: Map, [x, y]: Coordinates): number { //Counts points given by a fortress.
    return -2;
}
function getRandomInt(max: number): number { //Returns a random whole number between 0 and param max {number}.
    return Math.floor(Math.random() * max);
}


function create_building_queue(items: number): Queue<string> {
    const building_queue = empty<string>(); 

    for (let i = 0; i < items; i++){
        enqueue(buildings[getRandomInt(buildings.length)], building_queue);
    }
    
    return building_queue;
}

export function spawn_barbarian(map: Map): void {
    let empty_tiles: Array<Coordinates> = [];

    for(let y = 0; y < map.length; y++){
        for(let x = 0; x < map[y].length; x++){
            if (get_property(map, pair(x, y)) === "E") {
                empty_tiles.push(pair(x, y));
            }
        }
    }

    if (empty_tiles.length > 0) {
        const spawn_point = empty_tiles[getRandomInt(empty_tiles.length)];
        change_property(map, spawn_point, "B");
        console.log(`A barbarian has appeared at ${spawn_point}!`);
    }

}


export function is_protected_by_fortress(map: Map, coordinates: Coordinates) {
    let adjacent_tiles: Array<Coordinates> = neighboring_tiles(map, coordinates); 

    for (let adj of adjacent_tiles){
        if (get_property(map, adj) === "F"){
            return true;
        }
    }
    return false;
}


function spread_barbarian(map: Map): void {
    let new_barbarians: Array<Coordinates> = [];

    for(let y = 0; y < map.length; y++){
        for(let x = 0; x < map[y].length; x++){

            if (get_property(map, pair(x, y)) === "B") {
                let adjacent_tiles: Array<Coordinates> = neighboring_tiles(map, pair(x, y));

                if (adjacent_tiles.length > 0){
                    let random_tile: Coordinates = adjacent_tiles[getRandomInt(adjacent_tiles.length)];
                    let property: String = get_property(map, random_tile);
                    if ((property === "E" || property === "H" || property === "C")
                        && !is_protected_by_fortress(map, random_tile)) {
                            new_barbarians.push(random_tile);
                    }
                }
            }
        }
    }

    for (let tile of new_barbarians) {
        change_property(map, tile, "B");
    }

    if (new_barbarians.length > 0) {
        console.log(`The barbarians have taken new territory!`)
    }
}

function clear_adjacent_barbarians(map: Map, coordinates: Coordinates): void {
    let adjacent_tiles = neighboring_tiles(map, coordinates); 

    for (let adj of adjacent_tiles){
        if (get_property(map, adj) === "B"){
            change_property(map, adj, "E");
        }
    }
}

function upgrade_to_fortress(map: Map, coordinates: Coordinates, game_points: number): number {
    if (game_points < 3){
        console.log(` *** You have insufficient points to build a fortress! (3 points required) *** `);
        return game_points;
    }
    if (get_property(map, coordinates) === "H") {
        change_property(map, coordinates, "F"); //Konverterar house till fortress
        clear_adjacent_barbarians(map, coordinates);
        console.log(`You have built a Fortress at ${coordinates}! The surrounding barbarians are repelled.`)
        return game_points - 3;
    } else {
        console.log(` *** You can only upgrade a house to a fortress! *** `)
        return game_points;
    }
}



/**
 * Places (if possible) a building on a cell.
 * @param {Map} map - The map to place on.
 * @param {Coordintaes} coordinates - The coordinates to place building on.
 * @param {str} building - The building to place.
 * @returns {boolean} - True if placement went through, false otherwise.
 * @precondition - Str must be a valid building in the game.
 * @complexity Theta(1)
 */
export function place(map: Map, coordinates: Coordinates, building: string): boolean {
    if (building === "Lumberjack") {
        if (get_property(map, coordinates) === "T") { 
            change_property(map, coordinates, "E");
            console.log(`You used a lumberjack to remove trees at coordinates ${coordinates}!`);
            return true;
        }
        if (get_property(map, coordinates) === "E") {
            console.log(`You gave the lumberjack a day off.`);
            return true;
        }
        else {
            console.log(" *** Non-empty tile. Try again. *** ");
            return false;
        }
    }
    if (get_property(map, coordinates) === "E") {
        change_property(map, coordinates, building[0].toUpperCase());
        console.log(`You have built a ${building} at coordinates ${coordinates}!`);
        return true;   
    }
    else {
        console.log(" *** Non-empty tile. Try again. *** ");
        return false;
    }
}
/**
 * The main function containing the user input loop. Creates a map, counts points, handles player inputs.
 */
function main(): void {
    let game_map: Map = create_map(size_x, size_y);
    let game_running: boolean = true;
    let game_turn: number = 0;
    let game_points: number = 0;
            
    const prompt = promptSync();
    const building_queue: Queue<string> = create_building_queue(3);

    spawn_barbarian(game_map);
    

    while (game_running) {
        console.log(" ");
        display_map(game_map);
        console.log(`Day: ${game_turn}`)
        console.log(`Points: ${game_points}`)
        console.log(" ");

        
        
        const current_building: string = head(building_queue);
    
        console.log(`Building to place: ${current_building}`);

        const user_choice: string = prompt(`Do you want to (1) place a building or (2) upgrade a house to a fortress?`);
        if (user_choice !== "1" && user_choice !== "2") { // Kan ej CTRL + C avsluta här av någon anledning... välj 1/2 sen avsluta isf.
            console.log(" *** Invalid choice! *** ");
            continue;
        }

        if(user_choice === "2") { // Väljer att uppgradera hus till Fortress.
            const user_coordinates: string = prompt('Enter coordinate of house: ');
            const [x, y]: Array<number> = user_coordinates.split(',').map(Number);
            if (x < 0 || y < 0 || x >= size_x || y >= size_y || isNaN(x) || isNaN(y)) {
                console.log(" *** Invalid coordinates, try again! *** ");
                continue; 
            }
            
            let new_game_points = upgrade_to_fortress(game_map, pair(x, y), game_points);
            if (new_game_points !== game_points) { //Om man har 3 poäng
                game_points = new_game_points;
                continue; // Hoppa över att välja från building queue
            } else {
                continue; // Uppgradering misslyckas
            }
        }

        const user_coordinates: string = prompt('Enter coordinate of choosing: ');
        const [x, y]: Array<number> = user_coordinates.split(',').map(Number);
        if (x < 0 || y < 0 || x >= size_x || y >= size_y || isNaN(x) || isNaN(y)) {
            console.log(" *** Invalid coordinates, try again! *** ");
            continue; 
        }
    
        
        if (!place(game_map, pair(x, y), current_building)) {
            continue;
        }
        
        
        game_points = count_total_points(game_map);
        dequeue(building_queue);
        game_turn += 1;
        
        enqueue(buildings[getRandomInt(buildings.length)], building_queue);

        spread_barbarian(game_map);

        //console.log(`-----------------------------------------`) // För synlighet i terminalen mellan dagar(turns)
    }
}

//main();