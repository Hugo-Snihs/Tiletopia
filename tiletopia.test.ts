import { get_property, create_map, change_property } from "./maps";
import { count_total_points, place, spawn_barbarian, is_protected_by_fortress, upgrade_to_fortress} from "./main";

test('Barbarians spawn on single tile', () => {
    const x = 1;
    const y = 1;
    const my_map = create_map(x, y);
    change_property(my_map, [0, 0], "E")
    change_property(my_map, [0, 0], "E");
    spawn_barbarian(my_map);
    expect(my_map[0][0].property).toStrictEqual("B")});

test('Fortress clears surrounding tiles of barbarians', () => { 
    const x = 2;
    const y = 2;
    const my_map = create_map(x, y);
    change_property(my_map, [1, 0], "B")
    change_property(my_map, [0, 0], "H");
    upgrade_to_fortress(my_map, [0, 0], 3);
    expect(my_map[1][0].property).toStrictEqual("E")});
    
test('Placing a house, a church and connecting them with a road. Then counting points', () => {
    const x = 4
    const y = 4
    const my_map = create_map(x, y)
    change_property(my_map, [0, 1], "E");
    change_property(my_map, [1, 1], "E");
    change_property(my_map, [2, 1], "E");
    place(my_map, [0, 1], "House")
    place(my_map, [1, 1], "Road")
    place(my_map, [2, 1], "Church")
    expect(count_total_points(my_map)).toEqual(2)});
