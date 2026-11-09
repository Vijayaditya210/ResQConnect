import { Coordinates } from '../types';

export function calculateDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1.28 * 10) / 10; // Apply road curvature factor
}

export function estimateTravelTimeMins(distanceKm: number, avgSpeedKmh: number = 36): number {
  return Math.max(5, Math.round((distanceKm / avgSpeedKmh) * 60));
}

export function generateRouteWaypoints(
  start: Coordinates,
  end: Coordinates,
  steps: number = 18
): Coordinates[] {
  const waypoints: Coordinates[] = [];
  const midLat = (start.lat + end.lat) / 2;
  const midLng = (start.lng + end.lng) / 2;
  const offsetLat = (end.lng - start.lng) * 0.08;
  const offsetLng = -(end.lat - start.lat) * 0.08;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat =
      Math.pow(1 - t, 2) * start.lat +
      2 * (1 - t) * t * (midLat + offsetLat) +
      Math.pow(t, 2) * end.lat;
    const lng =
      Math.pow(1 - t, 2) * start.lng +
      2 * (1 - t) * t * (midLng + offsetLng) +
      Math.pow(t, 2) * end.lng;
    waypoints.push({
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6))
    });
  }
  return waypoints;
}

export function interpolatePosition(
  waypoints: Coordinates[],
  progressRatio: number
): { position: Coordinates; stepIndex: number } {
  if (!waypoints || waypoints.length === 0) {
    return { position: { lat: 16.5062, lng: 80.6480 }, stepIndex: 0 };
  }
  if (progressRatio <= 0) {
    return { position: waypoints[0], stepIndex: 0 };
  }
  if (progressRatio >= 1) {
    return { position: waypoints[waypoints.length - 1], stepIndex: waypoints.length - 1 };
  }

  const exactIndex = progressRatio * (waypoints.length - 1);
  const baseIndex = Math.floor(exactIndex);
  const frac = exactIndex - baseIndex;
  const p1 = waypoints[baseIndex];
  const p2 = waypoints[Math.min(baseIndex + 1, waypoints.length - 1)];

  const currentLat = p1.lat + (p2.lat - p1.lat) * frac;
  const currentLng = p1.lng + (p2.lng - p1.lng) * frac;

  return {
    position: {
      lat: Number(currentLat.toFixed(6)),
      lng: Number(currentLng.toFixed(6))
    },
    stepIndex: baseIndex
  };
}
