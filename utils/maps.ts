import { Location } from '../types/trip';

/**
 * Map utility functions.
 * Currently provides basic calculations.
 * Replace with Google Maps API integration for production.
 */

export function calculateDistance(from: Location, to: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function getMapUrl(location: Location, label?: string): string {
  const query = label
    ? encodeURIComponent(label)
    : `${location.lat},${location.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getCenterPoint(locations: Location[]): Location {
  if (locations.length === 0) return { lat: 0, lng: 0 };

  const sum = locations.reduce(
    (acc, loc) => ({ lat: acc.lat + loc.lat, lng: acc.lng + loc.lng }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sum.lat / locations.length,
    lng: sum.lng / locations.length,
  };
}
