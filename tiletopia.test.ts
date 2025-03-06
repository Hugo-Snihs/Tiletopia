import { get_property, create_map } from "./maps";
import { count_total_points, place, spawn_barbarian, is_protected_by_fortress} from "./main";

test('Barbarians spawn on single tile', () => {
    const x = 1;
    const y = 1;
    const my_map = create_map(x, y);
    spawn_barbarian(my_map);
    expect(my_map[0][0].property).toStrictEqual("B")});