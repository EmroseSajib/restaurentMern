// ===========================================
// MENU DATA
// All dishes with multilingual support
// ===========================================

export type SpiceLevel = "mild" | "medium" | "hot" | "veryHot"
export type DietaryTag = "vegetarian" | "vegan" | "glutenFree"
export type MenuCategory =
  | "popular"
  | "main"
  | "starters"
  | "traditional"
  | "tandoori"
  | "kufte"
  | "sides"
  | "desserts"
  | "drinks"

export interface MenuItem {
  id: string
  name: {
    en: string
    nl: string
    de: string
  }
  description: {
    en: string
    nl: string
    de: string
  }
  price: number
  category: MenuCategory
  spiceLevel?: SpiceLevel
  dietary?: DietaryTag[]
  image?: string
  isPopular?: boolean
  isNew?: boolean
}

export const menuItems: MenuItem[] = [
  // POPULAR DISHES
  {
    id: "butter-chicken",
    name: {
      en: "Butter Chicken",
      nl: "Butter Chicken",
      de: "Butter Chicken",
    },
    description: {
      en: "Tender chicken in a rich, creamy tomato-based sauce with aromatic spices",
      nl: "Malse kip in een rijke, romige tomatensaus met aromatische kruiden",
      de: "Zartes Hähnchen in einer reichhaltigen, cremigen Tomatensauce mit aromatischen Gewürzen",
    },
    price: 16.5,
    category: "popular",
    spiceLevel: "mild",
    image: "/butter-chicken-indian-dish-creamy-tomato.jpg",
    isPopular: true,
  },
  {
    id: "chicken-tikka-masala",
    name: {
      en: "Chicken Tikka Masala",
      nl: "Chicken Tikka Masala",
      de: "Chicken Tikka Masala",
    },
    description: {
      en: "Grilled chicken pieces in a spiced curry sauce with yogurt and cream",
      nl: "Gegrilde kipstukken in een gekruide currysaus met yoghurt en room",
      de: "Gegrillte Hühnchenstücke in einer gewürzten Currysauce mit Joghurt und Sahne",
    },
    price: 17.5,
    category: "popular",
    spiceLevel: "medium",
    image: "/chicken-tikka-masala-indian-curry.jpg",
    isPopular: true,
  },
  {
    id: "lamb-biryani",
    name: {
      en: "Lamb Biryani",
      nl: "Lamsvlees Biryani",
      de: "Lamm Biryani",
    },
    description: {
      en: "Fragrant basmati rice layered with tender lamb and aromatic spices",
      nl: "Geurige basmatirijst gelaagd met malse lamsvlees en aromatische kruiden",
      de: "Duftender Basmatireis geschichtet mit zartem Lamm und aromatischen Gewürzen",
    },
    price: 19.5,
    category: "popular",
    spiceLevel: "medium",
    image: "/lamb-biryani-indian-rice-dish.jpg",
    isPopular: true,
  },
  {
    id: "palak-paneer",
    name: {
      en: "Palak Paneer",
      nl: "Palak Paneer",
      de: "Palak Paneer",
    },
    description: {
      en: "Fresh spinach curry with homemade cottage cheese cubes",
      nl: "Verse spinaziecurry met huisgemaakte paneerblokjes",
      de: "Frischer Spinatcurry mit hausgemachten Paneer-Würfeln",
    },
    price: 14.5,
    category: "popular",
    spiceLevel: "mild",
    dietary: ["vegetarian", "glutenFree"],
    image: "/palak-paneer-spinach-indian-vegetarian.jpg",
    isPopular: true,
  },

  // STARTERS / VOORGERECHTEN
  {
    id: "samosa",
    name: {
      en: "Vegetable Samosa",
      nl: "Groente Samosa",
      de: "Gemüse Samosa",
    },
    description: {
      en: "Crispy pastry triangles filled with spiced potatoes and peas (2 pieces)",
      nl: "Krokante pasteidriehoekjes gevuld met gekruide aardappelen en erwten (2 stuks)",
      de: "Knusprige Teigtaschen gefüllt mit gewürzten Kartoffeln und Erbsen (2 Stück)",
    },
    price: 5.5,
    category: "starters",
    spiceLevel: "mild",
    dietary: ["vegetarian", "vegan"],
    image: "/vegetable-samosa-indian-appetizer.jpg",
  },
  {
    id: "onion-bhaji",
    name: {
      en: "Onion Bhaji",
      nl: "Uien Bhaji",
      de: "Zwiebel Bhaji",
    },
    description: {
      en: "Crispy onion fritters with chickpea flour and spices (4 pieces)",
      nl: "Krokante uienbeignets met kikkererwtenmeel en kruiden (4 stuks)",
      de: "Knusprige Zwiebelbeignets mit Kichererbsenmehl und Gewürzen (4 Stück)",
    },
    price: 6.0,
    category: "starters",
    spiceLevel: "mild",
    dietary: ["vegetarian", "vegan", "glutenFree"],
    image: "/onion-bhaji-indian-fritter.jpg",
  },
  {
    id: "chicken-pakora",
    name: {
      en: "Chicken Pakora",
      nl: "Kip Pakora",
      de: "Hähnchen Pakora",
    },
    description: {
      en: "Tender chicken pieces in a crispy spiced batter",
      nl: "Malse kipstukken in een krokant gekruid beslag",
      de: "Zarte Hühnchenstücke in einem knusprigen gewürzten Teig",
    },
    price: 7.5,
    category: "starters",
    spiceLevel: "medium",
    image: "/chicken-pakora-indian-appetizer.jpg",
  },
  {
    id: "paneer-tikka",
    name: {
      en: "Paneer Tikka",
      nl: "Paneer Tikka",
      de: "Paneer Tikka",
    },
    description: {
      en: "Marinated cottage cheese cubes grilled in tandoor with peppers",
      nl: "Gemarineerde paneerblokjes gegrild in tandoor met paprika",
      de: "Marinierte Paneer-Würfel im Tandoor gegrillt mit Paprika",
    },
    price: 8.5,
    category: "starters",
    spiceLevel: "medium",
    dietary: ["vegetarian", "glutenFree"],
    image: "/paneer-tikka-grilled-cheese-indian.jpg",
  },
  {
    id: "soup-mulligatawny",
    name: {
      en: "Mulligatawny Soup",
      nl: "Mulligatawny Soep",
      de: "Mulligatawny Suppe",
    },
    description: {
      en: "Traditional Indian spiced lentil soup with herbs",
      nl: "Traditionele Indiase gekruide linzensoep met kruiden",
      de: "Traditionelle indische gewürzte Linsensuppe mit Kräutern",
    },
    price: 6.5,
    category: "starters",
    spiceLevel: "mild",
    dietary: ["vegetarian", "vegan", "glutenFree"],
    image: "/mulligatawny-soup-indian-lentil.jpg",
  },

  // MAIN COURSES / HOOFDGERECHTEN
  {
    id: "chicken-korma",
    name: {
      en: "Chicken Korma",
      nl: "Kip Korma",
      de: "Hähnchen Korma",
    },
    description: {
      en: "Mild chicken curry with cashews, cream and aromatic spices",
      nl: "Milde kipcurry met cashewnoten, room en aromatische kruiden",
      de: "Milder Hähnchencurry mit Cashewnüssen, Sahne und aromatischen Gewürzen",
    },
    price: 15.5,
    category: "main",
    spiceLevel: "mild",
    dietary: ["glutenFree"],
    image: "/chicken-korma-mild-indian-curry.jpg",
  },
  {
    id: "lamb-rogan-josh",
    name: {
      en: "Lamb Rogan Josh",
      nl: "Lamsvlees Rogan Josh",
      de: "Lamm Rogan Josh",
    },
    description: {
      en: "Kashmiri lamb curry cooked with yogurt, garlic and Kashmiri chillies",
      nl: "Kasjmiri lamscurry bereid met yoghurt, knoflook en Kasjmiri pepers",
      de: "Kaschmiri Lammcurry zubereitet mit Joghurt, Knoblauch und Kaschmiri Chilis",
    },
    price: 18.5,
    category: "main",
    spiceLevel: "hot",
    dietary: ["glutenFree"],
    image: "/lamb-rogan-josh-red-curry-indian.jpg",
  },
  {
    id: "prawn-curry",
    name: {
      en: "King Prawn Curry",
      nl: "Gamba Curry",
      de: "Riesengarnelen Curry",
    },
    description: {
      en: "Succulent king prawns in a coconut and tomato curry sauce",
      nl: "Sappige gamba's in een kokos-tomatencurrysaus",
      de: "Saftige Riesengarnelen in einer Kokos-Tomaten-Currysauce",
    },
    price: 19.5,
    category: "main",
    spiceLevel: "medium",
    dietary: ["glutenFree"],
    image: "/king-prawn-curry-indian-seafood.jpg",
  },
  {
    id: "chicken-vindaloo",
    name: {
      en: "Chicken Vindaloo",
      nl: "Kip Vindaloo",
      de: "Hähnchen Vindaloo",
    },
    description: {
      en: "Fiery Goan curry with potatoes, vinegar and hot spices",
      nl: "Vurige Goaanse curry met aardappelen, azijn en hete kruiden",
      de: "Feuriger Goan-Curry mit Kartoffeln, Essig und scharfen Gewürzen",
    },
    price: 16.5,
    category: "main",
    spiceLevel: "veryHot",
    dietary: ["glutenFree"],
    image: "/chicken-vindaloo-spicy-indian-curry.jpg",
  },
  {
    id: "dal-makhani",
    name: {
      en: "Dal Makhani",
      nl: "Dal Makhani",
      de: "Dal Makhani",
    },
    description: {
      en: "Creamy black lentils slow-cooked with butter and spices",
      nl: "Romige zwarte linzen langzaam gekookt met boter en kruiden",
      de: "Cremige schwarze Linsen langsam gekocht mit Butter und Gewürzen",
    },
    price: 13.5,
    category: "main",
    spiceLevel: "mild",
    dietary: ["vegetarian", "glutenFree"],
    image: "/dal-makhani-black-lentils-indian.jpg",
  },
  {
    id: "chana-masala",
    name: {
      en: "Chana Masala",
      nl: "Chana Masala",
      de: "Chana Masala",
    },
    description: {
      en: "Chickpeas cooked in a spiced tomato and onion gravy",
      nl: "Kikkererwten bereid in een gekruide tomaat-uiensaus",
      de: "Kichererbsen in einer gewürzten Tomaten-Zwiebel-Sauce",
    },
    price: 13.0,
    category: "main",
    spiceLevel: "medium",
    dietary: ["vegetarian", "vegan", "glutenFree"],
    image: "/chana-masala-chickpea-curry-indian.jpg",
  },
  {
    id: "aloo-gobi",
    name: {
      en: "Aloo Gobi",
      nl: "Aloo Gobi",
      de: "Aloo Gobi",
    },
    description: {
      en: "Potatoes and cauliflower cooked with turmeric and cumin",
      nl: "Aardappelen en bloemkool bereid met kurkuma en komijn",
      de: "Kartoffeln und Blumenkohl mit Kurkuma und Kreuzkümmel",
    },
    price: 12.5,
    category: "main",
    spiceLevel: "mild",
    dietary: ["vegetarian", "vegan", "glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
  },

  // TRADITIONAL / TRADITIONELE
  {
    id: "chicken-madras",
    name: {
      en: "Chicken Madras",
      nl: "Kip Madras",
      de: "Hähnchen Madras",
    },
    description: {
      en: "South Indian curry with coconut, curry leaves and mustard seeds",
      nl: "Zuid-Indiase curry met kokos, kerriebladen en mosterdzaad",
      de: "Südindischer Curry mit Kokosnuss, Curryblättern und Senfkörnern",
    },
    price: 16.0,
    category: "traditional",
    spiceLevel: "hot",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "beef-keema",
    name: {
      en: "Beef Keema",
      nl: "Rundergehakt Keema",
      de: "Rinderhackfleisch Keema",
    },
    description: {
      en: "Minced beef cooked with peas, ginger and garam masala",
      nl: "Rundergehakt bereid met erwten, gember en garam masala",
      de: "Rinderhackfleisch mit Erbsen, Ingwer und Garam Masala",
    },
    price: 16.5,
    category: "traditional",
    spiceLevel: "medium",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "goat-curry",
    name: {
      en: "Goat Curry",
      nl: "Geitenvlees Curry",
      de: "Ziegenfleisch Curry",
    },
    description: {
      en: "Tender goat meat slow-cooked in traditional spices",
      nl: "Mals geitenvlees langzaam gekookt in traditionele kruiden",
      de: "Zartes Ziegenfleisch langsam in traditionellen Gewürzen gekocht",
    },
    price: 20.0,
    category: "traditional",
    spiceLevel: "medium",
    image: "/placeholder.svg?height=300&width=400",
  },

  // TANDOORI & GRILL
  {
    id: "tandoori-chicken",
    name: {
      en: "Tandoori Chicken",
      nl: "Tandoori Kip",
      de: "Tandoori Hähnchen",
    },
    description: {
      en: "Half chicken marinated in yogurt and spices, grilled in clay oven",
      nl: "Halve kip gemarineerd in yoghurt en kruiden, gegrild in kleioven",
      de: "Halbes Hähnchen mariniert in Joghurt und Gewürzen, im Lehmofen gegrillt",
    },
    price: 17.5,
    category: "tandoori",
    spiceLevel: "medium",
    dietary: ["glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "seekh-kebab",
    name: {
      en: "Seekh Kebab",
      nl: "Seekh Kebab",
      de: "Seekh Kebab",
    },
    description: {
      en: "Minced lamb skewers with herbs and spices, grilled to perfection",
      nl: "Lamsgehakt spiesjes met kruiden, perfect gegrild",
      de: "Lammhackfleischspieße mit Kräutern und Gewürzen, perfekt gegrillt",
    },
    price: 16.0,
    category: "tandoori",
    spiceLevel: "medium",
    dietary: ["glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "fish-tikka",
    name: {
      en: "Fish Tikka",
      nl: "Vis Tikka",
      de: "Fisch Tikka",
    },
    description: {
      en: "Chunks of white fish marinated and grilled in tandoor",
      nl: "Stukken witte vis gemarineerd en gegrild in tandoor",
      de: "Stücke von weißem Fisch mariniert und im Tandoor gegrillt",
    },
    price: 18.0,
    category: "tandoori",
    spiceLevel: "medium",
    dietary: ["glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "mixed-grill",
    name: {
      en: "Mixed Tandoori Grill",
      nl: "Gemengde Tandoori Grill",
      de: "Gemischter Tandoori Grill",
    },
    description: {
      en: "Selection of tandoori chicken, seekh kebab, and chicken tikka",
      nl: "Selectie van tandoori kip, seekh kebab en chicken tikka",
      de: "Auswahl an Tandoori-Hähnchen, Seekh Kebab und Chicken Tikka",
    },
    price: 22.5,
    category: "tandoori",
    spiceLevel: "medium",
    dietary: ["glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
    isPopular: true,
  },

  // KUFTE (GEHAKTBAL) SPECIALS
  {
    id: "lamb-kofta-curry",
    name: {
      en: "Lamb Kofta Curry",
      nl: "Lamskofta Curry",
      de: "Lamm Kofta Curry",
    },
    description: {
      en: "Spiced lamb meatballs in a rich onion and tomato gravy",
      nl: "Gekruide lamsgehaktballen in een rijke ui-tomatensaus",
      de: "Gewürzte Lammfleischbällchen in einer reichhaltigen Zwiebel-Tomaten-Sauce",
    },
    price: 17.5,
    category: "kufte",
    spiceLevel: "medium",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "malai-kofta",
    name: {
      en: "Malai Kofta",
      nl: "Malai Kofta",
      de: "Malai Kofta",
    },
    description: {
      en: "Vegetarian dumplings made with paneer and potato in creamy sauce",
      nl: "Vegetarische balletjes van paneer en aardappel in romige saus",
      de: "Vegetarische Klöße aus Paneer und Kartoffeln in cremiger Sauce",
    },
    price: 15.5,
    category: "kufte",
    spiceLevel: "mild",
    dietary: ["vegetarian"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "chicken-kofta",
    name: {
      en: "Chicken Kofta Masala",
      nl: "Kip Kofta Masala",
      de: "Hähnchen Kofta Masala",
    },
    description: {
      en: "Tender chicken meatballs in spiced masala gravy",
      nl: "Malse kipgehaktballen in gekruide masalasaus",
      de: "Zarte Hähnchenfleischbällchen in gewürzter Masala-Sauce",
    },
    price: 16.0,
    category: "kufte",
    spiceLevel: "medium",
    image: "/placeholder.svg?height=300&width=400",
  },

  // SIDES & BREAD
  {
    id: "plain-naan",
    name: {
      en: "Plain Naan",
      nl: "Gewone Naan",
      de: "Einfaches Naan",
    },
    description: {
      en: "Traditional Indian flatbread baked in tandoor",
      nl: "Traditioneel Indiaas platbrood gebakken in tandoor",
      de: "Traditionelles indisches Fladenbrot im Tandoor gebacken",
    },
    price: 3.0,
    category: "sides",
    dietary: ["vegetarian"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "garlic-naan",
    name: {
      en: "Garlic Naan",
      nl: "Knoflook Naan",
      de: "Knoblauch Naan",
    },
    description: {
      en: "Naan bread topped with garlic and coriander",
      nl: "Naanbrood met knoflook en koriander",
      de: "Naan-Brot mit Knoblauch und Koriander",
    },
    price: 3.5,
    category: "sides",
    dietary: ["vegetarian"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "peshwari-naan",
    name: {
      en: "Peshwari Naan",
      nl: "Peshwari Naan",
      de: "Peshwari Naan",
    },
    description: {
      en: "Sweet naan stuffed with coconut, almonds and raisins",
      nl: "Zoete naan gevuld met kokos, amandelen en rozijnen",
      de: "Süßes Naan gefüllt mit Kokosnuss, Mandeln und Rosinen",
    },
    price: 4.0,
    category: "sides",
    dietary: ["vegetarian"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "basmati-rice",
    name: {
      en: "Basmati Rice",
      nl: "Basmati Rijst",
      de: "Basmatireis",
    },
    description: {
      en: "Steamed fragrant basmati rice",
      nl: "Gestoomde geurige basmatirijst",
      de: "Gedämpfter duftender Basmatireis",
    },
    price: 3.5,
    category: "sides",
    dietary: ["vegetarian", "vegan", "glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "pilau-rice",
    name: {
      en: "Pilau Rice",
      nl: "Pilav Rijst",
      de: "Pilau Reis",
    },
    description: {
      en: "Basmati rice cooked with cumin, cardamom and saffron",
      nl: "Basmatirijst bereid met komijn, kardemom en saffraan",
      de: "Basmatireis mit Kreuzkümmel, Kardamom und Safran",
    },
    price: 4.0,
    category: "sides",
    dietary: ["vegetarian", "vegan", "glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "raita",
    name: {
      en: "Raita",
      nl: "Raita",
      de: "Raita",
    },
    description: {
      en: "Cooling yogurt dip with cucumber and mint",
      nl: "Verkoelende yoghurtdip met komkommer en munt",
      de: "Kühlender Joghurt-Dip mit Gurke und Minze",
    },
    price: 2.5,
    category: "sides",
    dietary: ["vegetarian", "glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "mango-chutney",
    name: {
      en: "Mango Chutney",
      nl: "Mango Chutney",
      de: "Mango Chutney",
    },
    description: {
      en: "Sweet and tangy mango condiment",
      nl: "Zoete en pittige mangocondiment",
      de: "Süßes und würziges Mango-Würzmittel",
    },
    price: 2.0,
    category: "sides",
    dietary: ["vegetarian", "vegan", "glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "papadum",
    name: {
      en: "Papadum",
      nl: "Papadum",
      de: "Papadum",
    },
    description: {
      en: "Crispy lentil wafers (4 pieces)",
      nl: "Krokante linzenwafels (4 stuks)",
      de: "Knusprige Linsen-Waffeln (4 Stück)",
    },
    price: 2.5,
    category: "sides",
    dietary: ["vegetarian", "vegan", "glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
  },

  // DESSERTS
  {
    id: "gulab-jamun",
    name: {
      en: "Gulab Jamun",
      nl: "Gulab Jamun",
      de: "Gulab Jamun",
    },
    description: {
      en: "Deep-fried milk dumplings in rose-flavored syrup (3 pieces)",
      nl: "Gefrituurde melkballetjes in rozenwater siroop (3 stuks)",
      de: "Frittierte Milchbällchen in Rosensirup (3 Stück)",
    },
    price: 5.5,
    category: "desserts",
    dietary: ["vegetarian"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "kheer",
    name: {
      en: "Kheer",
      nl: "Kheer",
      de: "Kheer",
    },
    description: {
      en: "Traditional Indian rice pudding with cardamom and nuts",
      nl: "Traditionele Indiase rijstpudding met kardemom en noten",
      de: "Traditioneller indischer Milchreis mit Kardamom und Nüssen",
    },
    price: 5.0,
    category: "desserts",
    dietary: ["vegetarian", "glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "mango-kulfi",
    name: {
      en: "Mango Kulfi",
      nl: "Mango Kulfi",
      de: "Mango Kulfi",
    },
    description: {
      en: "Indian ice cream with mango and pistachios",
      nl: "Indiaas ijs met mango en pistachenoten",
      de: "Indisches Eis mit Mango und Pistazien",
    },
    price: 5.5,
    category: "desserts",
    dietary: ["vegetarian", "glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "rasmalai",
    name: {
      en: "Rasmalai",
      nl: "Rasmalai",
      de: "Rasmalai",
    },
    description: {
      en: "Soft paneer dumplings in sweetened milk with saffron (3 pieces)",
      nl: "Zachte paneerballetjes in gezoete melk met saffraan (3 stuks)",
      de: "Weiche Paneer-Klöße in gesüßter Milch mit Safran (3 Stück)",
    },
    price: 6.0,
    category: "desserts",
    dietary: ["vegetarian", "glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
  },

  // DRINKS
  {
    id: "mango-lassi",
    name: {
      en: "Mango Lassi",
      nl: "Mango Lassi",
      de: "Mango Lassi",
    },
    description: {
      en: "Refreshing yogurt drink with mango",
      nl: "Verfrissende yoghurtdrank met mango",
      de: "Erfrischendes Joghurtgetränk mit Mango",
    },
    price: 4.5,
    category: "drinks",
    dietary: ["vegetarian", "glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "sweet-lassi",
    name: {
      en: "Sweet Lassi",
      nl: "Zoete Lassi",
      de: "Süßer Lassi",
    },
    description: {
      en: "Traditional sweet yogurt drink",
      nl: "Traditionele zoete yoghurtdrank",
      de: "Traditionelles süßes Joghurtgetränk",
    },
    price: 4.0,
    category: "drinks",
    dietary: ["vegetarian", "glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "masala-chai",
    name: {
      en: "Masala Chai",
      nl: "Masala Chai",
      de: "Masala Chai",
    },
    description: {
      en: "Spiced Indian tea with milk",
      nl: "Gekruide Indiase thee met melk",
      de: "Gewürzter indischer Tee mit Milch",
    },
    price: 3.5,
    category: "drinks",
    dietary: ["vegetarian", "glutenFree"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "indian-beer",
    name: {
      en: "Kingfisher Beer",
      nl: "Kingfisher Bier",
      de: "Kingfisher Bier",
    },
    description: {
      en: "Premium Indian lager (330ml)",
      nl: "Premium Indiaas pilsner (330ml)",
      de: "Premium indisches Lagerbier (330ml)",
    },
    price: 4.5,
    category: "drinks",
    image: "/placeholder.svg?height=300&width=400",
  },
]

export function getMenuItemsByCategory(category: MenuCategory): MenuItem[] {
  return menuItems.filter((item) => item.category === category)
}

export function getPopularItems(): MenuItem[] {
  return menuItems.filter((item) => item.isPopular)
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id)
}

export const menuCategories: { key: MenuCategory; priority: number }[] = [
  { key: "popular", priority: 1 },
  { key: "main", priority: 2 },
  { key: "starters", priority: 3 },
  { key: "traditional", priority: 4 },
  { key: "tandoori", priority: 5 },
  { key: "kufte", priority: 6 },
  { key: "sides", priority: 7 },
  { key: "desserts", priority: 8 },
  { key: "drinks", priority: 9 },
]
