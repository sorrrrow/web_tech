const DISHES = [
  // SOUP (6) fish 2 / meat 2 / veg 2
  { keyword: "gaspacho", name: "Гаспачо", price: 195, category: "soup", count: "350 г", image: "images/soup_gazpacho.jpg", kind: "veg" },
  { keyword: "mushroom_cream", name: "Грибной суп-пюре", price: 185, category: "soup", count: "330 г", image: "images/soup_mushroom.jpg", kind: "veg" },
  { keyword: "tom_yam_shrimp", name: "Том ям с креветками", price: 650, category: "soup", count: "500 г", image: "images/soup_tomyam.jpg", kind: "fish" },
  { keyword: "ramen", name: "Рамен", price: 375, category: "soup", count: "425 г", image: "images/soup_ramen.jpg", kind: "meat" },
  { keyword: "chicken_soup", name: "Куриный суп", price: 330, category: "soup", count: "350 г", image: "images/soup_chicken.jpg", kind: "meat" },
  { keyword: "fish_chowder", name: "Рыбный суп", price: 420, category: "soup", count: "380 г", image: "images/soup_fish.jpg", kind: "fish" },

  // MAIN (6) fish 2 / meat 2 / veg 2
  { keyword: "fried_potato_mushrooms", name: "Жареная картошка с грибами", price: 150, category: "main", count: "250 г", image: "images/main_potato.jpg", kind: "veg" },
  { keyword: "lasagna", name: "Лазанья", price: 385, category: "main", count: "310 г", image: "images/main_lasagna.jpg", kind: "meat" },
  { keyword: "chicken_cutlets_mash", name: "Котлеты из курицы с картофельным пюре", price: 225, category: "main", count: "280 г", image: "images/main_cutlet.jpg", kind: "meat" },
  { keyword: "fish_cutlet_rice", name: "Рыбная котлета с рисом и спаржей", price: 320, category: "main", count: "270 г", image: "images/main_fish_cutlet.jpg", kind: "fish" },
  { keyword: "shrimp_pasta", name: "Паста с креветками", price: 340, category: "main", count: "280 г", image: "images/main_shrimp_pasta.jpg", kind: "fish" },
  { keyword: "margarita_pizza", name: "Пицца Маргарита", price: 450, category: "main", count: "470 г", image: "images/main_pizza.jpg", kind: "veg" },

  // STARTER (6) fish 1 / meat 1 / veg 4
  { keyword: "tuna_salad", name: "Салат с тунцом", price: 480, category: "starter", count: "250 г", image: "images/starter_tuna.jpg", kind: "fish" },
  { keyword: "korean_veg_salad", name: "Корейский салат с овощами и яйцом", price: 330, category: "starter", count: "250 г", image: "images/starter_korean.jpg", kind: "veg" },
  { keyword: "caesar_chicken", name: "Цезарь с цыпленком", price: 370, category: "starter", count: "220 г", image: "images/starter_caesar.jpg", kind: "meat" },
  { keyword: "caprese", name: "Капрезе с моцареллой", price: 350, category: "starter", count: "235 г", image: "images/starter_caprese.jpg", kind: "veg" },
  { keyword: "fries_caesar", name: "Картофель фри с соусом Цезарь", price: 280, category: "starter", count: "235 г", image: "images/starter_fries_caesar.jpg", kind: "veg" },
  { keyword: "fries_ketchup", name: "Картофель фри с кетчупом", price: 260, category: "starter", count: "235 г", image: "images/starter_fries_ketchup.jpg", kind: "veg" },

  // DRINK (6) cold 3 / hot 3
  { keyword: "orange_juice", name: "Апельсиновый сок", price: 120, category: "drink", count: "300 мл", image: "images/drink_orange.jpg", kind: "cold" },
  { keyword: "apple_juice", name: "Яблочный сок", price: 90, category: "drink", count: "300 мл", image: "images/drink_apple.jpg", kind: "cold" },
  { keyword: "carrot_juice", name: "Морковный сок", price: 110, category: "drink", count: "300 мл", image: "images/drink_carrot.jpg", kind: "cold" },
  { keyword: "cappuccino", name: "Капучино", price: 180, category: "drink", count: "300 мл", image: "images/drink_cappuccino.jpg", kind: "hot" },
  { keyword: "green_tea", name: "Зелёный чай", price: 100, category: "drink", count: "300 мл", image: "images/drink_green_tea.jpg", kind: "hot" },
  { keyword: "black_tea", name: "Чёрный чай", price: 90, category: "drink", count: "300 мл", image: "images/drink_black_tea.jpg", kind: "hot" },

  // DESSERT (6) small 3 / medium 2 / big 1
  { keyword: "baklava", name: "Пахлава", price: 220, category: "dessert", count: "300 г", image: "images/dessert_baklava.jpg", kind: "small" },
  { keyword: "cheesecake", name: "Чизкейк", price: 240, category: "dessert", count: "125 г", image: "images/dessert_cheesecake.jpg", kind: "medium" },
  { keyword: "choco_cheesecake", name: "Шоколадный чизкейк", price: 260, category: "dessert", count: "125 г", image: "images/dessert_choco_cheesecake.jpg", kind: "medium" },
  { keyword: "choco_cake", name: "Шоколадный торт", price: 270, category: "dessert", count: "140 г", image: "images/dessert_choco_cake.jpg", kind: "small" },
  { keyword: "donuts_3", name: "Пончики (3 штуки)", price: 410, category: "dessert", count: "350 г", image: "images/dessert_donuts_3.jpg", kind: "small" },
  { keyword: "donuts_6", name: "Пончики (6 штук)", price: 650, category: "dessert", count: "700 г", image: "images/dessert_donuts_6.jpg", kind: "big" }
];