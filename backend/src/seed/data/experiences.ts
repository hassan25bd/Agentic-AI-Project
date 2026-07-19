export interface SeedExperience {
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  price: number;
  currency: string;
  location: { city: string; country: string };
  category:
    | "Adventure"
    | "Culture"
    | "Food & Drink"
    | "Nature"
    | "Relaxation"
    | "City Life";
  durationDays: number;
  availableFrom: string;
  tags: string[];
  highlights: string[];
  included: string[];
  hostEmail: string;
}

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export const seedExperiences: SeedExperience[] = [
  {
    title: "Kyoto Temple & Geisha District Walk",
    shortDescription:
      "Wander the lantern-lit lanes of Higashiyama and Gion at dawn, before the crowds arrive.",
    fullDescription:
      "Start before sunrise at Kiyomizu-dera's wooden terrace, then trace the stone-paved streets of Higashiyama down into Gion as the machiya shopfronts open for the day. Your guide is a Kyoto native who has spent a decade documenting the city's temple architecture and can point out details most walking tours miss - the carved eaves at Yasaka Shrine, the tea houses where apprentice geiko still train. The walk ends with a seated matcha tasting led by a local tea master.",
    images: [img("1493976040374-85c8e12f0c0e")],
    price: 145,
    currency: "USD",
    location: { city: "Kyoto", country: "Japan" },
    category: "Culture",
    durationDays: 1,
    availableFrom: "2026-09-05",
    tags: ["temples", "walking tour", "tea ceremony", "photography"],
    highlights: [
      "Private access to Kiyomizu-dera before public opening hours",
      "Guided walk through Higashiyama and Gion's historic streets",
      "Seated matcha tasting with a certified tea master",
    ],
    included: ["Local guide", "Temple entry fees", "Matcha tasting", "Bottled water"],
    hostEmail: "priya.host@voyager.app",
  },
  {
    title: "Jaipur Pink City Heritage Tour",
    shortDescription:
      "Explore Hawa Mahal, Amber Fort, and Jaipur's bazaars with a historian who grew up in the old city.",
    fullDescription:
      "Jaipur's old city was planned in 1727 around principles of Vastu Shastra, and this tour is built to reveal that logic block by block. You'll ride an open-top jeep up to Amber Fort at first light, walk the ramparts of Nahargarh for a panoramic view of the pink-washed old city, then spend the afternoon in the bazaars around Hawa Mahal learning to spot genuine block-print textiles and Kundan jewelry from tourist-trap imitations. Finish with a rooftop dinner overlooking the City Palace.",
    images: [img("1477587458883-47145ed94245")],
    price: 120,
    currency: "USD",
    location: { city: "Jaipur", country: "India" },
    category: "Culture",
    durationDays: 1,
    availableFrom: "2026-10-12",
    tags: ["heritage", "architecture", "shopping", "history"],
    highlights: [
      "Jeep ride up to Amber Fort at sunrise",
      "Guided walk of Hawa Mahal and the City Palace complex",
      "Textile and jewelry authentication tips in the local bazaars",
      "Rooftop dinner with old-city views",
    ],
    included: ["Historian guide", "Fort entry fees", "Jeep transfer", "Rooftop dinner"],
    hostEmail: "priya.host@voyager.app",
  },
  {
    title: "Taj Mahal Sunrise & Agra Old Town",
    shortDescription:
      "Watch the marble change color at sunrise, then explore the old town's spice markets and Agra Fort.",
    fullDescription:
      "The Taj Mahal is genuinely different at sunrise - the marble shifts from soft pink to blinding white as the light climbs, and the gardens are nearly empty. Your guide, an Agra-based architectural historian, explains the symmetry and inlay work up close before the tour groups arrive. The rest of the day covers Agra Fort's red sandstone ramparts and a walk through the spice and marble-inlay markets of the old town, ending with a home-hosted lunch with an Agra family.",
    images: [img("1524492412937-b28074a5d7da")],
    price: 110,
    currency: "USD",
    location: { city: "Agra", country: "India" },
    category: "Culture",
    durationDays: 1,
    availableFrom: "2026-09-20",
    tags: ["UNESCO", "architecture", "sunrise", "history"],
    highlights: [
      "Sunrise entry to the Taj Mahal ahead of tour groups",
      "Architectural walkthrough with a local historian",
      "Agra Fort and old-town spice market visit",
      "Home-hosted family lunch",
    ],
    included: ["Guide", "Monument entry fees", "Home-hosted lunch", "Transfers within Agra"],
    hostEmail: "priya.host@voyager.app",
  },
  {
    title: "Bali Water Temples & Rice Terraces",
    shortDescription:
      "Visit the lake temple of Ulun Danu Beratan and the terraced rice paddies of Jatiluwih on a slow, guided day.",
    fullDescription:
      "This day trip is paced around light and quiet rather than a checklist. You'll reach Ulun Danu Beratan, the multi-tiered temple that appears to float on Lake Bratan, before the tour buses arrive, then drive up into the highlands to walk the UNESCO-listed rice terraces of Jatiluwih with a subak (irrigation cooperative) member who explains the centuries-old water-sharing system that keeps the terraces green year-round. Lunch is a home-cooked Balinese spread overlooking the terraces.",
    images: [img("1537996194471-e657df975ab4")],
    price: 95,
    currency: "USD",
    location: { city: "Bali", country: "Indonesia" },
    category: "Culture",
    durationDays: 1,
    availableFrom: "2026-08-15",
    tags: ["temples", "rice terraces", "nature", "slow travel"],
    highlights: [
      "Early access to Ulun Danu Beratan lake temple",
      "Guided walk through Jatiluwih's UNESCO rice terraces",
      "Conversation with a local subak irrigation cooperative member",
      "Home-cooked Balinese lunch with terrace views",
    ],
    included: ["Guide", "Temple donation fees", "Lunch", "Private car transfer"],
    hostEmail: "priya.host@voyager.app",
  },
  {
    title: "Wadi Rum & Petra Desert Expedition",
    shortDescription:
      "Camp under the stars in Wadi Rum, then walk the Siq into Petra as the Treasury catches first light.",
    fullDescription:
      "Two days deep in Jordan's desert south. Day one is a 4x4 route through Wadi Rum's red-sand valleys and narrow canyons with a Bedouin guide, ending at a low-impact desert camp for a night of clear-sky stargazing. Day two starts before dawn with the walk through the Siq - the narrow gorge that opens suddenly onto the Treasury facade - timed so you reach it as the first sunlight hits the carved stone. The afternoon is free to explore the Monastery trail at your own pace.",
    images: [img("1579606032821-4e6161c81bd3"), img("1500530855697-b586d89ba3ee")],
    price: 320,
    currency: "USD",
    location: { city: "Wadi Musa", country: "Jordan" },
    category: "Adventure",
    durationDays: 2,
    availableFrom: "2026-11-02",
    tags: ["desert", "camping", "UNESCO", "stargazing"],
    highlights: [
      "4x4 Bedouin-guided route through Wadi Rum",
      "Overnight at a low-impact desert camp",
      "Dawn walk through the Siq to the Petra Treasury",
      "Free afternoon on the Monastery trail",
    ],
    included: ["Bedouin guide", "Desert camp lodging", "All meals", "Petra entry fees"],
    hostEmail: "diego.host@voyager.app",
  },
  {
    title: "Queenstown Alpine Adventure",
    shortDescription:
      "Canyon swing, alpine trek, and a jet-boat run through the Shotover Canyon in New Zealand's adventure capital.",
    fullDescription:
      "A full day built around Queenstown's landscape rather than its bungee-jump reputation, though there's time for that too if you want it. Morning starts with a guided alpine trek up toward Ben Lomond for views across Lake Wakatipu and the Remarkables range, followed by a jet-boat run through the narrow rock walls of Shotover Canyon. The day is capped with an optional canyon swing for anyone who wants the adrenaline hit, and a lakeside dinner back in town.",
    images: [img("1589802829985-817e51171b92")],
    price: 210,
    currency: "USD",
    location: { city: "Queenstown", country: "New Zealand" },
    category: "Adventure",
    durationDays: 1,
    availableFrom: "2026-12-01",
    tags: ["hiking", "jet boat", "mountains", "adrenaline"],
    highlights: [
      "Guided alpine trek toward Ben Lomond",
      "Shotover Canyon jet-boat run",
      "Optional canyon swing",
      "Lakeside dinner in Queenstown",
    ],
    included: ["Mountain guide", "Jet-boat ride", "Trail lunch", "Transfers"],
    hostEmail: "diego.host@voyager.app",
  },
  {
    title: "Machu Picchu Trek via the Sacred Valley",
    shortDescription:
      "A guided route through the Sacred Valley up to Machu Picchu, timed to reach the citadel before the midday crowds.",
    fullDescription:
      "This trek follows a shorter, less-crowded route through Peru's Sacred Valley, acclimatizing in Ollantaytambo before the final ascent. Your guide is a Cusco-based archaeologist who has worked on Inca-trail conservation projects and explains the site's astronomical alignment as you walk the terraces. You'll reach the Sun Gate as the morning mist clears off the citadel - one of the more reliable ways to see Machu Picchu without the mid-morning crowds.",
    images: [img("1526392060635-9d6019884377")],
    price: 380,
    currency: "USD",
    location: { city: "Cusco", country: "Peru" },
    category: "Adventure",
    durationDays: 3,
    availableFrom: "2026-09-28",
    tags: ["trekking", "UNESCO", "archaeology", "mountains"],
    highlights: [
      "Acclimatization stop in Ollantaytambo",
      "Guided by a Cusco-based archaeologist",
      "Sun Gate arrival ahead of midday crowds",
      "Full-day exploration of the Machu Picchu terraces",
    ],
    included: ["Archaeologist guide", "Train tickets", "2 nights lodging", "All meals on trek"],
    hostEmail: "amara.host@voyager.app",
  },
  {
    title: "Annapurna Base Camp Trek",
    shortDescription:
      "A multi-day trek through rhododendron forest and Gurung villages up to Annapurna Base Camp.",
    fullDescription:
      "This is the classic Annapurna Sanctuary route, run in small groups with a Nepali mountain guide and porter support. You'll pass through Gurung and Magar villages, climb through rhododendron forest that blooms deep red in spring, and spend the final night at Base Camp itself, ringed by the Annapurna massif and Machapuchare. Pacing is built around altitude - two acclimatization stops are included so the trek stays enjoyable rather than a forced march.",
    images: [img("1526772662000-3f88f10405ff")],
    price: 295,
    currency: "USD",
    location: { city: "Pokhara", country: "Nepal" },
    category: "Adventure",
    durationDays: 5,
    availableFrom: "2026-10-05",
    tags: ["trekking", "mountains", "Himalayas", "villages"],
    highlights: [
      "Small-group trek with a licensed Nepali mountain guide",
      "Overnight at Annapurna Base Camp",
      "Two built-in acclimatization stops",
      "Village stays with Gurung and Magar host families",
    ],
    included: ["Mountain guide", "Porter", "Teahouse lodging", "All meals on trail"],
    hostEmail: "amara.host@voyager.app",
  },
  {
    title: "Tuscany Vineyard & Wine Tasting Day",
    shortDescription:
      "A guided tasting through three family-run Chianti vineyards, paired with a traditional Tuscan lunch.",
    fullDescription:
      "Three generations-old wineries in the Chianti hills open their cellars for this small-group tasting day. You'll walk the vine rows with each winemaker, learn how the region's galestro soil shapes the Sangiovese grape, and taste through their Chianti Classico and Riserva lines. The day includes a sit-down lunch at a farmhouse table - handmade pici pasta, local pecorino, and olive oil pressed on the property.",
    images: [img("1506377247377-2a5b3b417ebb")],
    price: 165,
    currency: "USD",
    location: { city: "Chianti", country: "Italy" },
    category: "Food & Drink",
    durationDays: 1,
    availableFrom: "2026-09-12",
    tags: ["wine tasting", "vineyards", "farm to table", "countryside"],
    highlights: [
      "Tastings at three family-run Chianti wineries",
      "Vineyard walk with the winemakers",
      "Farmhouse lunch with handmade pici pasta",
      "Small group of 8 travelers or fewer",
    ],
    included: ["Wine tastings", "Farmhouse lunch", "Transport between vineyards", "Sommelier guide"],
    hostEmail: "marco.host@voyager.app",
  },
  {
    title: "Valencia Paella & Tapas Trail",
    shortDescription:
      "Cook an authentic paella valenciana with a local chef, then hop between family-run tapas bars in the old town.",
    fullDescription:
      "Paella originated in Valencia's rice fields, and this experience starts there - a hands-on cooking class with a chef who still uses her grandmother's wood-fired technique, covering the difference between paella valenciana and the seafood versions served to tourists. After the cooking class and shared lunch, the evening moves into Valencia's old town for a guided tapas trail through three family-run bars that don't appear on typical tourist lists.",
    images: [img("1515443961218-a51367888e4b")],
    price: 130,
    currency: "USD",
    location: { city: "Valencia", country: "Spain" },
    category: "Food & Drink",
    durationDays: 1,
    availableFrom: "2026-08-22",
    tags: ["cooking class", "tapas", "local food", "evening tour"],
    highlights: [
      "Hands-on paella valenciana cooking class",
      "Shared lunch of what you cook",
      "Guided evening tapas trail in the old town",
      "Visits to three family-run tapas bars",
    ],
    included: ["Cooking class", "Ingredients", "Lunch", "Tapas and one drink at each stop"],
    hostEmail: "marco.host@voyager.app",
  },
  {
    title: "Paris Market & Bistro Food Tour",
    shortDescription:
      "Shop a Left Bank market with a chef, then sit down to a multi-course bistro lunch built from what you bought.",
    fullDescription:
      "This tour starts at a Left Bank produce market with a working Parisian chef, tasting cheeses, charcuterie, and seasonal produce as you go and learning what separates a good baguette from a great one. From there you'll head to a small bistro where the chef prepares a multi-course lunch using ingredients selected at the market, paired with natural wines from small producers. It's as much a lesson in how Parisians actually eat as it is a meal.",
    images: [img("1414235077428-338989a2e8c0")],
    price: 155,
    currency: "USD",
    location: { city: "Paris", country: "France" },
    category: "Food & Drink",
    durationDays: 1,
    availableFrom: "2026-10-18",
    tags: ["market tour", "bistro", "wine pairing", "cooking"],
    highlights: [
      "Guided tasting walk through a Left Bank produce market",
      "Multi-course bistro lunch prepared from market ingredients",
      "Natural wine pairing from small producers",
      "Led by a working Parisian chef",
    ],
    included: ["Chef guide", "Market tastings", "Bistro lunch", "Wine pairing"],
    hostEmail: "marco.host@voyager.app",
  },
  {
    title: "Serengeti Safari Camp",
    shortDescription:
      "Three days tracking the Great Migration by open-top 4x4, staying at a low-impact tented camp.",
    fullDescription:
      "Timed where possible around the Great Migration's position, this safari runs twice-daily game drives out of a small tented camp with a resident naturalist guide. Mornings and evenings are for driving - when the light is best and the animals are most active - while the heat of the day is for camp downtime, guided bird walks near camp, or a Maasai-led walk to a nearby village. Camp runs on solar power and a strict no-plastic policy.",
    images: [img("1516026672322-bc52d61a55d5")],
    price: 410,
    currency: "USD",
    location: { city: "Serengeti", country: "Tanzania" },
    category: "Nature",
    durationDays: 3,
    availableFrom: "2026-11-15",
    tags: ["safari", "wildlife", "camping", "Great Migration"],
    highlights: [
      "Twice-daily game drives with a naturalist guide",
      "Low-impact solar-powered tented camp",
      "Optional Maasai-led village walk",
      "Great Migration tracking, season permitting",
    ],
    included: ["Naturalist guide", "Tented camp lodging", "All meals", "Game drives"],
    hostEmail: "amara.host@voyager.app",
  },
  {
    title: "Banff & Moraine Lake Adventure",
    shortDescription:
      "Canoe the turquoise water of Moraine Lake at sunrise, then hike into the Canadian Rockies' backcountry.",
    fullDescription:
      "Moraine Lake's color comes from glacial rock flour suspended in the water, and it's most vivid in the first hour after sunrise, before the wind picks up - which is exactly when this tour puts you on the water in a canoe. The rest of the day is a guided hike into the Valley of the Ten Peaks with a Parks Canada-certified guide who covers the area's glaciology and wildlife safety, ending with a lodge dinner in Banff.",
    images: [img("1493246507139-91e8fad9978e")],
    price: 175,
    currency: "USD",
    location: { city: "Banff", country: "Canada" },
    category: "Nature",
    durationDays: 1,
    availableFrom: "2026-08-30",
    tags: ["hiking", "canoeing", "mountains", "lakes"],
    highlights: [
      "Sunrise canoe on Moraine Lake",
      "Guided hike into the Valley of the Ten Peaks",
      "Parks Canada-certified guide",
      "Lodge dinner in Banff",
    ],
    included: ["Canoe rental", "Hiking guide", "Trail lunch", "Dinner"],
    hostEmail: "amara.host@voyager.app",
  },
  {
    title: "Faroe Islands Highland Hike",
    shortDescription:
      "A guided ridge hike across the Faroe Islands' green highlands, with sea-cliff and waterfall views.",
    fullDescription:
      "The Faroe Islands pack dramatic terrain into a small footprint - sheer sea cliffs, waterfalls that blow sideways in the wind, and ridgelines that drop straight into the North Atlantic. This hike follows a shepherd's route across the highlands above Streymoy with a local guide who grew up herding sheep on these same trails, stopping at an overlook above Múlafossur waterfall before descending into a village for a traditional dried-fish tasting.",
    images: [img("1469474968028-56623f02e42e")],
    price: 140,
    currency: "USD",
    location: { city: "Streymoy", country: "Faroe Islands" },
    category: "Nature",
    durationDays: 1,
    availableFrom: "2026-07-30",
    tags: ["hiking", "coastal", "waterfalls", "remote"],
    highlights: [
      "Ridge hike across the Streymoy highlands",
      "Overlook above Múlafossur waterfall",
      "Guided by a local former sheep herder",
      "Traditional dried-fish tasting in a fishing village",
    ],
    included: ["Local guide", "Trail snacks", "Village tasting", "Transfers"],
    hostEmail: "amara.host@voyager.app",
  },
  {
    title: "Santorini Cliffside Retreat",
    shortDescription:
      "Two slow days in Oia and Fira - caldera walks, a sunset sailing trip, and a private wine terrace dinner.",
    fullDescription:
      "This retreat is built for pace rather than sightseeing volume. Day one is a guided walk along the caldera rim from Fira to Oia, timed to reach Oia's whitewashed lanes as the famous sunset crowd is just gathering, before slipping down a quieter staircase to a private terrace for dinner. Day two is a half-day catamaran trip around the caldera with a stop for swimming near the volcanic hot springs, capped with a sunset wine tasting on board.",
    images: [img("1533105079780-92b9be482077")],
    price: 260,
    currency: "USD",
    location: { city: "Santorini", country: "Greece" },
    category: "Relaxation",
    durationDays: 2,
    availableFrom: "2026-08-10",
    tags: ["sunset", "sailing", "wine", "caldera views"],
    highlights: [
      "Guided caldera-rim walk from Fira to Oia",
      "Private terrace sunset dinner",
      "Half-day catamaran trip with volcanic hot-spring swim",
      "On-board sunset wine tasting",
    ],
    included: ["Guide", "Catamaran trip", "Two dinners", "Wine tasting"],
    hostEmail: "diego.host@voyager.app",
  },
  {
    title: "Maldives Overwater Bungalow Escape",
    shortDescription:
      "Three nights in an overwater bungalow with snorkeling, a sunset cruise, and an in-water spa treatment.",
    fullDescription:
      "A slow-paced stay built around the reef just off your bungalow deck. Mornings are for guided snorkeling trips out to the house reef and a nearby manta ray cleaning station (seasonal, sightings not guaranteed but common), afternoons are unstructured, and the stay includes one sunset dolphin-watching cruise and one overwater spa treatment. Meals are half-board, with one dinner served on a private sandbank that appears only at low tide.",
    images: [img("1590523277543-a94d2e4eb00b"), img("1512100356356-de1b84283e18")],
    price: 890,
    currency: "USD",
    location: { city: "Male Atoll", country: "Maldives" },
    category: "Relaxation",
    durationDays: 3,
    availableFrom: "2026-12-10",
    tags: ["overwater bungalow", "snorkeling", "spa", "island"],
    highlights: [
      "Overwater bungalow with direct reef access",
      "Guided snorkeling and seasonal manta ray sightings",
      "Sunset dolphin-watching cruise",
      "Private sandbank dinner at low tide",
    ],
    included: ["Bungalow lodging", "Half-board meals", "Snorkeling gear", "One spa treatment"],
    hostEmail: "diego.host@voyager.app",
  },
  {
    title: "Cinque Terre Coastal Getaway",
    shortDescription:
      "Walk the cliffside trail between Cinque Terre's five villages, with a boat ride back to close the loop.",
    fullDescription:
      "The trail linking Cinque Terre's five villages runs directly along the cliffs above the Ligurian Sea, and this trip walks the most scenic legs of it at an easy pace, stopping in each village for focaccia, anchovies, or a gelato depending on the hour. Rather than retracing the trail back, the day ends with a boat ride from Riomaggiore back up the coast to Monterosso, giving you the same cliffside views from the water at golden hour.",
    images: [img("1499678329028-101435549a4e")],
    price: 105,
    currency: "USD",
    location: { city: "Cinque Terre", country: "Italy" },
    category: "Relaxation",
    durationDays: 1,
    availableFrom: "2026-09-08",
    tags: ["coastal hike", "villages", "boat ride", "food stops"],
    highlights: [
      "Cliffside trail walk between the five villages",
      "Local food stops in each village",
      "Golden-hour boat ride back along the coast",
      "Small group, easy-to-moderate pace",
    ],
    included: ["Guide", "Trail permits", "Boat ride", "Food tastings"],
    hostEmail: "diego.host@voyager.app",
  },
  {
    title: "Lisbon Trams & Alfama Discovery",
    shortDescription:
      "Ride the historic Tram 28 route and wander Alfama's alleys with a fado singer's family for context.",
    fullDescription:
      "Lisbon's Alfama district survived the 1755 earthquake that leveled most of the city, and its layout still shows it - narrow, uneven alleys that climb the hill toward São Jorge Castle. This tour rides the iconic yellow Tram 28 through the old quarters, then continues on foot through Alfama with a guide from a multi-generation fado family, who explains the music's history before an evening fado performance in a small, unamplified venue.",
    images: [img("1585208798174-6cedd86e019a")],
    price: 90,
    currency: "USD",
    location: { city: "Lisbon", country: "Portugal" },
    category: "City Life",
    durationDays: 1,
    availableFrom: "2026-09-25",
    tags: ["trams", "fado", "old town", "music"],
    highlights: [
      "Ride on the historic Tram 28 route",
      "Guided walk through Alfama's alleys",
      "Fado history from a multi-generation fado family",
      "Evening fado performance in an intimate venue",
    ],
    included: ["Tram fare", "Local guide", "Fado performance ticket", "One drink"],
    hostEmail: "marco.host@voyager.app",
  },
  {
    title: "Prague Old Town Explorer",
    shortDescription:
      "Climb the Astronomical Clock tower, cross Charles Bridge at dawn, and explore Prague Castle with a historian.",
    fullDescription:
      "Prague's Old Town is dense enough that a good route matters - this one starts on Charles Bridge at dawn, when it's nearly empty of the statue-lined crowds that fill it by mid-morning, then climbs the Old Town Hall's Astronomical Clock tower for a rooftop view over the red rooftops. The afternoon covers Prague Castle and St. Vitus Cathedral with a historian guide who focuses on the city's Bohemian and Habsburg-era history rather than a generic highlight reel.",
    images: [img("1541849546-216549ae216d")],
    price: 100,
    currency: "USD",
    location: { city: "Prague", country: "Czech Republic" },
    category: "City Life",
    durationDays: 1,
    availableFrom: "2026-10-01",
    tags: ["old town", "castle", "history", "architecture"],
    highlights: [
      "Dawn walk across Charles Bridge",
      "Astronomical Clock tower rooftop view",
      "Guided tour of Prague Castle and St. Vitus Cathedral",
      "Historian-led Bohemian history walk",
    ],
    included: ["Historian guide", "Tower and castle entry fees", "Breakfast pastry stop"],
    hostEmail: "marco.host@voyager.app",
  },
  {
    title: "Bangkok Street Food Night Market Crawl",
    shortDescription:
      "A tuk-tuk-linked crawl through Bangkok's night markets, eating your way from Chinatown to Ratchada.",
    fullDescription:
      "This crawl links three of Bangkok's best night markets by tuk-tuk, starting in the neon-lit food stalls of Chinatown (Yaowarat) for oyster omelets and roast duck, moving to a smaller neighborhood market for regional Isaan dishes rarely seen on tourist menus, and ending at the Ratchada train night market for dessert and a rooftop view. Your guide is a Bangkok food blogger who vets every stall for freshness and can navigate the Thai-only menus.",
    images: [img("1508009603885-50cf7c579365")],
    price: 65,
    currency: "USD",
    location: { city: "Bangkok", country: "Thailand" },
    category: "City Life",
    durationDays: 1,
    availableFrom: "2026-08-05",
    tags: ["street food", "night market", "tuk-tuk", "local guide"],
    highlights: [
      "Tuk-tuk transfers between three night markets",
      "Chinatown (Yaowarat) street food tasting",
      "Regional Isaan dishes off the tourist menu",
      "Rooftop dessert stop at Ratchada night market",
    ],
    included: ["Local food guide", "Tuk-tuk transfers", "All tastings"],
    hostEmail: "marco.host@voyager.app",
  },
];
