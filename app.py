from dataclasses import dataclass


@dataclass(frozen=True)
class Dish:
    name: str
    calories_per_100g: float


DISHES = {
    "борщ": Dish("Борщ", 49),
    "плов": Dish("Плов", 180),
    "гречка": Dish("Гречка", 110),
    "рис": Dish("Рис", 130),
    "овсянка": Dish("Овсянка", 88),
    "куриная грудка": Dish("Куриная грудка", 165),
    "котлета": Dish("Котлета", 250),
    "салат цезарь": Dish("Салат Цезарь", 190),
    "пюре": Dish("Картофельное пюре", 105),
    "омлет": Dish("Омлет", 154),
    "сырники": Dish("Сырники", 220),
    "яблоко": Dish("Яблоко", 52),
    "банан": Dish("Банан", 89),
}


def print_menu() -> None:
    print("\nДоступные блюда:")
    for index, dish in enumerate(DISHES.values(), start=1):
        print(f"{index}. {dish.name} — {dish.calories_per_100g} ккал на 100 г")


def get_dish_by_number(number: int) -> Dish | None:
    dishes = list(DISHES.values())
    if 1 <= number <= len(dishes):
        return dishes[number - 1]
    return None


def read_positive_float(prompt: str) -> float:
    while True:
        raw_value = input(prompt).strip().replace(",", ".")
        try:
            value = float(raw_value)
        except ValueError:
            print("Введите число, например 150.")
            continue

        if value <= 0:
            print("Значение должно быть больше нуля.")
            continue
        return value


def main() -> None:
    print("Калькулятор калорий по блюдам")
    print("Выберите блюда из списка и введите вес порции.")

    total_calories = 0.0
    selected_items: list[tuple[Dish, float, float]] = []

    while True:
        print_menu()
        choice = input(
            "\nВведите номер блюда, 'свое' для ручного ввода или 'готово' для расчета: "
        ).strip().lower()

        if choice == "готово":
            break

        if choice == "свое":
            custom_name = input("Название блюда: ").strip()
            if not custom_name:
                print("Название блюда не должно быть пустым.")
                continue

            calories_per_100g = read_positive_float("Калорийность на 100 г: ")
            weight = read_positive_float("Вес порции в граммах: ")
            calories = calories_per_100g * weight / 100
            selected_items.append((Dish(custom_name, calories_per_100g), weight, calories))
            total_calories += calories
            print(f"Добавлено: {custom_name} — {calories:.1f} ккал")
            continue

        if not choice.isdigit():
            print("Введите корректный номер, 'свое' или 'готово'.")
            continue

        dish = get_dish_by_number(int(choice))
        if dish is None:
            print("Блюдо с таким номером не найдено.")
            continue

        weight = read_positive_float(f"Введите вес блюда '{dish.name}' в граммах: ")
        calories = dish.calories_per_100g * weight / 100
        selected_items.append((dish, weight, calories))
        total_calories += calories
        print(f"Добавлено: {dish.name} — {calories:.1f} ккал")

    if not selected_items:
        print("\nВы не добавили ни одного блюда.")
        return

    print("\nВаш прием пищи:")
    for dish, weight, calories in selected_items:
        print(f"- {dish.name}: {weight:.0f} г -> {calories:.1f} ккал")

    print(f"\nИтого: {total_calories:.1f} ккал")


if __name__ == "__main__":
    main()
