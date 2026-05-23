export const fetchPlaceImage = async (placeName: string) => {
    const UNSPLASH_ACCESS_KEY = 'PASTE_YOUR_UNSPLASH_KEY_HERE';

    try {
        // Ask Unsplash for 1 photo matching the place name, oriented for mobile (portrait)
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(placeName)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1&orientation=portrait`;

        const response = await fetch(url);
        const data = await response.json();

        // If Unsplash has a photo, return the URL!
        if (data.results && data.results.length > 0) {
            return data.results[0].urls.regular;
        }

        // If they don't have a photo, return a fallback default image
        return 'https://images.unsplash.com/photo-1488646953014-c8bf089bb0c9?w=500&q=80';
    } catch (error) {
        console.error("Error fetching image from Unsplash:", error);
        return 'https://images.unsplash.com/photo-1488646953014-c8bf089bb0c9?w=500&q=80';
    }
};