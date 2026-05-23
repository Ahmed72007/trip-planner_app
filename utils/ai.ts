import { Place, TripPreference } from '../types/trip';

// ─── Mock AI Suggestion Engine ──────────────────────────────────────────────
// Structured for easy OpenAI API replacement later.
// Replace the mock logic with an API call to generate itineraries.

interface AIItineraryResponse {
  places: Omit<Place, 'id'>[];
  summary: string;
}

const CITY_DATA: Record<string, { places: Omit<Place, 'id'>[]; summary: string }> = {
  paris: {
    summary: 'Experience the magic of Paris — from iconic landmarks to hidden bistros and artistic treasures.',
    places: [
      { name: 'Eiffel Tower', description: 'Iconic iron lattice tower with stunning city views', location: { lat: 48.8584, lng: 2.2945 }, address: 'Champ de Mars, 5 Av. Anatole France', dayIndex: 0, time: '09:00', duration: 120, cost: 26, category: 'attraction', addedBy: 'ai', image: '🗼' },
      { name: 'Louvre Museum', description: 'World\'s largest art museum, home to the Mona Lisa', location: { lat: 48.8606, lng: 2.3376 }, address: 'Rue de Rivoli', dayIndex: 0, time: '13:00', duration: 180, cost: 17, category: 'museum', addedBy: 'ai', image: '🎨' },
      { name: 'Le Bouillon Chartier', description: 'Classic Parisian brasserie with affordable French cuisine', location: { lat: 48.8747, lng: 2.3456 }, address: '7 Rue du Fbg Montmartre', dayIndex: 0, time: '19:00', duration: 90, cost: 25, category: 'restaurant', addedBy: 'ai', image: '🍷' },
      { name: 'Montmartre & Sacré-Cœur', description: 'Charming hilltop neighborhood with stunning basilica', location: { lat: 48.8867, lng: 2.3431 }, address: '35 Rue du Chevalier de la Barre', dayIndex: 1, time: '09:00', duration: 150, cost: 0, category: 'attraction', addedBy: 'ai', image: '⛪' },
      { name: 'Musée d\'Orsay', description: 'Impressionist masterpieces in a stunning Beaux-Arts station', location: { lat: 48.8600, lng: 2.3266 }, address: '1 Rue de la Légion d\'Honneur', dayIndex: 1, time: '14:00', duration: 150, cost: 16, category: 'museum', addedBy: 'ai', image: '🖼️' },
      { name: 'Seine River Cruise', description: 'Evening cruise along the Seine with illuminated landmarks', location: { lat: 48.8589, lng: 2.2938 }, address: 'Port de la Bourdonnais', dayIndex: 1, time: '20:00', duration: 75, cost: 15, category: 'attraction', addedBy: 'ai', image: '🚢' },
      { name: 'Jardin du Luxembourg', description: 'Beautiful formal gardens perfect for a morning stroll', location: { lat: 48.8462, lng: 2.3372 }, address: 'Rue de Médicis', dayIndex: 2, time: '09:00', duration: 90, cost: 0, category: 'park', addedBy: 'ai', image: '🌳' },
      { name: 'Le Marais District', description: 'Trendy neighborhood with boutiques, galleries, and falafel', location: { lat: 48.8566, lng: 2.3621 }, address: 'Le Marais, Paris', dayIndex: 2, time: '12:00', duration: 180, cost: 20, category: 'shopping', addedBy: 'ai', image: '🛍️' },
      { name: 'Arc de Triomphe', description: 'Monumental arch with panoramic rooftop views', location: { lat: 48.8738, lng: 2.2950 }, address: 'Place Charles de Gaulle', dayIndex: 2, time: '17:00', duration: 60, cost: 13, category: 'attraction', addedBy: 'ai', image: '🏛️' },
    ],
  },
  tokyo: {
    summary: 'Dive into Tokyo\'s electric blend of ultra-modern tech and ancient temples.',
    places: [
      { name: 'Senso-ji Temple', description: 'Tokyo\'s oldest and most colorful Buddhist temple', location: { lat: 35.7148, lng: 139.7967 }, address: '2-3-1 Asakusa, Taito', dayIndex: 0, time: '08:00', duration: 120, cost: 0, category: 'attraction', addedBy: 'ai', image: '⛩️' },
      { name: 'Tsukiji Outer Market', description: 'Fresh sushi and street food paradise', location: { lat: 35.6654, lng: 139.7707 }, address: '4-16-2 Tsukiji, Chuo', dayIndex: 0, time: '11:00', duration: 120, cost: 30, category: 'restaurant', addedBy: 'ai', image: '🍣' },
      { name: 'Shibuya Crossing', description: 'World\'s busiest pedestrian crossing', location: { lat: 35.6595, lng: 139.7004 }, address: '2-2-1 Dogenzaka, Shibuya', dayIndex: 0, time: '16:00', duration: 60, cost: 0, category: 'attraction', addedBy: 'ai', image: '🚶' },
      { name: 'Meiji Shrine', description: 'Peaceful Shinto shrine surrounded by forest', location: { lat: 35.6764, lng: 139.6993 }, address: '1-1 Yoyogikamizonocho', dayIndex: 1, time: '09:00', duration: 90, cost: 0, category: 'attraction', addedBy: 'ai', image: '🌿' },
      { name: 'Harajuku & Takeshita Street', description: 'Tokyo\'s epicenter of youth fashion', location: { lat: 35.6702, lng: 139.7027 }, address: 'Jingumae, Shibuya', dayIndex: 1, time: '12:00', duration: 150, cost: 40, category: 'shopping', addedBy: 'ai', image: '👗' },
      { name: 'Akihabara Electric Town', description: 'Anime, manga, and electronics paradise', location: { lat: 35.7023, lng: 139.7745 }, address: 'Sotokanda, Chiyoda', dayIndex: 1, time: '16:00', duration: 120, cost: 20, category: 'shopping', addedBy: 'ai', image: '🎮' },
      { name: 'TeamLab Borderless', description: 'Immersive digital art museum', location: { lat: 35.6268, lng: 139.7839 }, address: 'Odaiba, Minato', dayIndex: 2, time: '10:00', duration: 150, cost: 32, category: 'museum', addedBy: 'ai', image: '✨' },
      { name: 'Shinjuku Gyoen Garden', description: 'Stunning Japanese garden in the heart of the city', location: { lat: 35.6852, lng: 139.7100 }, address: '11 Naitomachi, Shinjuku', dayIndex: 2, time: '14:00', duration: 90, cost: 5, category: 'park', addedBy: 'ai', image: '🌸' },
      { name: 'Golden Gai', description: 'Iconic narrow alleyways with tiny bars', location: { lat: 35.6938, lng: 139.7036 }, address: '1 Kabukicho, Shinjuku', dayIndex: 2, time: '20:00', duration: 120, cost: 35, category: 'nightlife', addedBy: 'ai', image: '🍶' },
    ],
  },
  'new york': {
    summary: 'The city that never sleeps — iconic skylines, world-class food, and endless culture.',
    places: [
      { name: 'Statue of Liberty', description: 'America\'s iconic symbol of freedom', location: { lat: 40.6892, lng: -74.0445 }, address: 'Liberty Island', dayIndex: 0, time: '08:00', duration: 180, cost: 24, category: 'attraction', addedBy: 'ai', image: '🗽' },
      { name: 'Central Park', description: 'An 843-acre green oasis in Manhattan', location: { lat: 40.7829, lng: -73.9654 }, address: 'Central Park, Manhattan', dayIndex: 0, time: '14:00', duration: 120, cost: 0, category: 'park', addedBy: 'ai', image: '🌳' },
      { name: 'Times Square', description: 'The dazzling heart of NYC entertainment', location: { lat: 40.7580, lng: -73.9855 }, address: 'Manhattan, NY', dayIndex: 0, time: '19:00', duration: 90, cost: 0, category: 'attraction', addedBy: 'ai', image: '🌃' },
      { name: 'Metropolitan Museum of Art', description: 'One of the world\'s greatest art collections', location: { lat: 40.7794, lng: -73.9632 }, address: '1000 5th Ave', dayIndex: 1, time: '09:00', duration: 180, cost: 30, category: 'museum', addedBy: 'ai', image: '🏛️' },
      { name: 'Brooklyn Bridge Walk', description: 'Iconic walk with stunning skyline views', location: { lat: 40.7061, lng: -73.9969 }, address: 'Brooklyn Bridge', dayIndex: 1, time: '15:00', duration: 90, cost: 0, category: 'attraction', addedBy: 'ai', image: '🌉' },
      { name: 'Chelsea Market', description: 'Gourmet food hall and shopping destination', location: { lat: 40.7425, lng: -74.0061 }, address: '75 9th Ave', dayIndex: 1, time: '18:00', duration: 120, cost: 35, category: 'restaurant', addedBy: 'ai', image: '🥘' },
      { name: 'Top of the Rock', description: 'Panoramic views of Manhattan and Central Park', location: { lat: 40.7593, lng: -73.9794 }, address: '30 Rockefeller Plaza', dayIndex: 2, time: '10:00', duration: 90, cost: 40, category: 'attraction', addedBy: 'ai', image: '🏙️' },
      { name: 'SoHo Shopping', description: 'Trendy boutiques and cast-iron architecture', location: { lat: 40.7233, lng: -73.9985 }, address: 'SoHo, Manhattan', dayIndex: 2, time: '13:00', duration: 150, cost: 50, category: 'shopping', addedBy: 'ai', image: '🛍️' },
      { name: 'Broadway Show', description: 'World-class theater performance', location: { lat: 40.7590, lng: -73.9845 }, address: 'Theater District', dayIndex: 2, time: '19:30', duration: 150, cost: 120, category: 'nightlife', addedBy: 'ai', image: '🎭' },
    ],
  },
  london: {
    summary: 'Royal heritage meets modern cool in this vibrant global capital.',
    places: [
      { name: 'Tower of London', description: 'Historic castle housing the Crown Jewels', location: { lat: 51.5081, lng: -0.0759 }, address: 'London EC3N 4AB', dayIndex: 0, time: '09:00', duration: 150, cost: 33, category: 'museum', addedBy: 'ai', image: '🏰' },
      { name: 'Borough Market', description: 'London\'s most renowned food market', location: { lat: 51.5055, lng: -0.0911 }, address: '8 Southwark St', dayIndex: 0, time: '12:30', duration: 120, cost: 25, category: 'restaurant', addedBy: 'ai', image: '🧀' },
      { name: 'British Museum', description: 'World-class collection spanning human history', location: { lat: 51.5194, lng: -0.1270 }, address: 'Great Russell St', dayIndex: 0, time: '15:00', duration: 180, cost: 0, category: 'museum', addedBy: 'ai', image: '🏛️' },
      { name: 'Buckingham Palace', description: 'Official London residence of the King', location: { lat: 51.5014, lng: -0.1419 }, address: 'London SW1A 1AA', dayIndex: 1, time: '09:30', duration: 90, cost: 30, category: 'attraction', addedBy: 'ai', image: '👑' },
      { name: 'Hyde Park', description: 'One of London\'s largest Royal Parks', location: { lat: 51.5073, lng: -0.1657 }, address: 'London W2 2UH', dayIndex: 1, time: '13:00', duration: 90, cost: 0, category: 'park', addedBy: 'ai', image: '🌿' },
      { name: 'Camden Market', description: 'Eclectic market with street food and vintage finds', location: { lat: 51.5414, lng: -0.1469 }, address: 'Camden Lock Pl', dayIndex: 1, time: '16:00', duration: 150, cost: 30, category: 'shopping', addedBy: 'ai', image: '🎸' },
    ],
  },
  rome: {
    summary: 'Walk through millennia of history, savor authentic Italian cuisine, and soak in la dolce vita.',
    places: [
      { name: 'Colosseum', description: 'Ancient amphitheater and architectural wonder', location: { lat: 41.8902, lng: 12.4922 }, address: 'Piazza del Colosseo', dayIndex: 0, time: '09:00', duration: 150, cost: 18, category: 'attraction', addedBy: 'ai', image: '🏟️' },
      { name: 'Roman Forum', description: 'Ruins of the heart of ancient Rome', location: { lat: 41.8925, lng: 12.4853 }, address: 'Via della Salara Vecchia', dayIndex: 0, time: '12:00', duration: 120, cost: 0, category: 'attraction', addedBy: 'ai', image: '🏛️' },
      { name: 'Trattoria Da Enzo', description: 'Beloved local trattoria in Trastevere', location: { lat: 41.8870, lng: 12.4695 }, address: 'Via dei Vascellari 29', dayIndex: 0, time: '19:00', duration: 90, cost: 22, category: 'restaurant', addedBy: 'ai', image: '🍝' },
      { name: 'Vatican Museums', description: 'Art treasures culminating in the Sistine Chapel', location: { lat: 41.9065, lng: 12.4536 }, address: 'Viale Vaticano', dayIndex: 1, time: '08:00', duration: 240, cost: 17, category: 'museum', addedBy: 'ai', image: '🎨' },
      { name: 'Trevi Fountain', description: 'Baroque masterpiece — throw a coin!', location: { lat: 41.9009, lng: 12.4833 }, address: 'Piazza di Trevi', dayIndex: 1, time: '16:00', duration: 45, cost: 0, category: 'attraction', addedBy: 'ai', image: '⛲' },
      { name: 'Piazza Navona', description: 'Stunning baroque square with fountains and artists', location: { lat: 41.8992, lng: 12.4731 }, address: 'Piazza Navona', dayIndex: 1, time: '18:00', duration: 90, cost: 15, category: 'attraction', addedBy: 'ai', image: '🎭' },
    ],
  },
  dubai: {
    summary: 'Futuristic skyline, luxury shopping, and desert adventures in the jewel of the Middle East.',
    places: [
      { name: 'Burj Khalifa', description: 'World\'s tallest building with observation decks', location: { lat: 25.1972, lng: 55.2744 }, address: '1 Sheikh Mohammed bin Rashid Blvd', dayIndex: 0, time: '09:00', duration: 120, cost: 40, category: 'attraction', addedBy: 'ai', image: '🏙️' },
      { name: 'Dubai Mall', description: 'World\'s largest shopping mall with aquarium', location: { lat: 25.1985, lng: 55.2796 }, address: 'Financial Center Rd', dayIndex: 0, time: '12:00', duration: 180, cost: 50, category: 'shopping', addedBy: 'ai', image: '🛍️' },
      { name: 'Dubai Fountain Show', description: 'Mesmerizing choreographed water show', location: { lat: 25.1952, lng: 55.2747 }, address: 'Downtown Dubai', dayIndex: 0, time: '20:00', duration: 30, cost: 0, category: 'attraction', addedBy: 'ai', image: '⛲' },
      { name: 'Desert Safari', description: 'Dune bashing, camel rides, and BBQ dinner', location: { lat: 24.9500, lng: 55.3000 }, address: 'Dubai Desert', dayIndex: 1, time: '15:00', duration: 300, cost: 80, category: 'attraction', addedBy: 'ai', image: '🐪' },
      { name: 'Palm Jumeirah', description: 'Iconic man-made island with luxury resorts', location: { lat: 25.1124, lng: 55.1390 }, address: 'Palm Jumeirah', dayIndex: 2, time: '10:00', duration: 180, cost: 0, category: 'attraction', addedBy: 'ai', image: '🌴' },
      { name: 'Gold & Spice Souks', description: 'Traditional markets brimming with treasures', location: { lat: 25.2697, lng: 55.3009 }, address: 'Deira, Dubai', dayIndex: 2, time: '15:00', duration: 120, cost: 20, category: 'shopping', addedBy: 'ai', image: '✨' },
    ],
  },
};

// Default fallback for unknown cities
const DEFAULT_PLACES: Omit<Place, 'id'>[] = [
  { name: 'City Center Exploration', description: 'Walk the main streets and discover local culture', location: { lat: 0, lng: 0 }, dayIndex: 0, time: '09:00', duration: 180, cost: 0, category: 'attraction', addedBy: 'ai', image: '🏙️' },
  { name: 'Local Food Tour', description: 'Sample the best local cuisine', location: { lat: 0, lng: 0 }, dayIndex: 0, time: '12:00', duration: 120, cost: 30, category: 'restaurant', addedBy: 'ai', image: '🍽️' },
  { name: 'Historical District', description: 'Explore the rich history of the area', location: { lat: 0, lng: 0 }, dayIndex: 0, time: '15:00', duration: 120, cost: 15, category: 'museum', addedBy: 'ai', image: '🏛️' },
  { name: 'Sunset Viewpoint', description: 'Catch a stunning sunset from a scenic spot', location: { lat: 0, lng: 0 }, dayIndex: 1, time: '17:00', duration: 60, cost: 0, category: 'attraction', addedBy: 'ai', image: '🌅' },
  { name: 'Local Market', description: 'Browse local crafts and souvenirs', location: { lat: 0, lng: 0 }, dayIndex: 1, time: '10:00', duration: 120, cost: 25, category: 'shopping', addedBy: 'ai', image: '🛍️' },
  { name: 'Nature Walk', description: 'Discover natural beauty nearby', location: { lat: 0, lng: 0 }, dayIndex: 1, time: '14:00', duration: 120, cost: 5, category: 'park', addedBy: 'ai', image: '🌿' },
];

function filterByPreferences(places: Omit<Place, 'id'>[], preferences: string[]): Omit<Place, 'id'>[] {
  if (!preferences.length) return places;

  const prefCategoryMap: Record<string, string[]> = {
    adventure: ['attraction', 'park'],
    food: ['restaurant'],
    culture: ['museum', 'attraction'],
    nature: ['park'],
    nightlife: ['nightlife'],
    shopping: ['shopping'],
    relaxation: ['park', 'attraction'],
    photography: ['attraction', 'park', 'museum'],
    history: ['museum', 'attraction'],
    art: ['museum'],
  };

  const relevantCategories = new Set<string>();
  preferences.forEach(p => {
    (prefCategoryMap[p] || []).forEach(c => relevantCategories.add(c));
  });

  // Boost preferred categories but include a mix
  const preferred = places.filter(p => p.category && relevantCategories.has(p.category));
  const others = places.filter(p => !p.category || !relevantCategories.has(p.category));

  return [...preferred, ...others];
}

function distributeAcrossDays(places: Omit<Place, 'id'>[], days: number): Omit<Place, 'id'>[] {
  const placesPerDay = Math.max(2, Math.ceil(places.length / days));
  const times = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '20:30'];

  return places.map((place, index) => {
    const dayIndex = Math.min(Math.floor(index / placesPerDay), days - 1);
    const timeIndex = index % placesPerDay;
    return {
      ...place,
      dayIndex,
      time: times[Math.min(timeIndex, times.length - 1)],
    };
  });
}

/**
 * Generate an AI-powered itinerary for a city.
 * Currently uses mock data. Replace with OpenAI API call for production.
 *
 * @example
 * // Future API integration:
 * // const response = await openai.chat.completions.create({
 * //   model: "gpt-4",
 * //   messages: [{ role: "user", content: prompt }],
 * // });
 */
export async function generateItinerary(
  city: string,
  days: number,
  preferences: string[]
): Promise<AIItineraryResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const cityKey = city.toLowerCase().trim();
  const cityData = CITY_DATA[cityKey];

  let places: Omit<Place, 'id'>[];
  let summary: string;

  if (cityData) {
    places = filterByPreferences(cityData.places, preferences);
    summary = cityData.summary;
  } else {
    places = DEFAULT_PLACES;
    summary = `Discover the best of ${city} with this curated itinerary featuring local highlights and hidden gems.`;
  }

  // Distribute places across the requested number of days
  places = distributeAcrossDays(places, days);

  return { places, summary };
}

/**
 * Get place suggestions for a specific category.
 * Placeholder for future API integration.
 */
export async function suggestPlaces(
  city: string,
  category: string,
  limit: number = 5
): Promise<Omit<Place, 'id'>[]> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const cityKey = city.toLowerCase().trim();
  const cityData = CITY_DATA[cityKey];

  if (cityData) {
    return cityData.places
      .filter(p => !category || p.category === category)
      .slice(0, limit);
  }

  return DEFAULT_PLACES.slice(0, limit);
}
