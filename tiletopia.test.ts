import { get_property, change_property, create_map } from "./maps";
import { count_total_points, place, spawn_barbarian, is_protected_by_fortress, spread_barbarian, upgrade_to_fortress} from "./main";

test('Barbarians spawn on single tile', () => {
    const x = 1;
    const y = 1;
    const my_map = create_map(x, y);
    change_property(my_map, [0, 0], "E")
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