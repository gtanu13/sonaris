import type { Detection } from "@/data/demoDetections";

export interface GeoBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export function computeBounds(detections: Detection[], paddingRatio = 0.22): GeoBounds {
  const lats = detections.map((d) => d.latitude);
  const lngs = detections.map((d) => d.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latPad = (maxLat - minLat) * paddingRatio || 0.002;
  const lngPad = (maxLng - minLng) * paddingRatio || 0.002;

  return {
    minLat: minLat - latPad,
    maxLat: maxLat + latPad,
    minLng: minLng - lngPad,
    maxLng: maxLng + lngPad,
  };
}

/** Projects a lat/lng into normalized 0–1 (x=lng, y=lat, north-up) space within the given bounds. */
export function project(lat: number, lng: number, bounds: GeoBounds) {
  const x = (lng - bounds.minLng) / (bounds.maxLng - bounds.minLng);
  const y = 1 - (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat);
  return { x, y };
}

/** Generates a "mowing the lawn" survey track pattern (typical side-scan sonar survey lines) within bounds. */
export function generateSurveyTrack(_bounds: GeoBounds, lineCount = 9) {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < lineCount; i++) {
    const x = (i + 0.5) / lineCount;
    const goingDown = i % 2 === 0;
    points.push({ x, y: goingDown ? 0.04 : 0.96 });
    points.push({ x, y: goingDown ? 0.96 : 0.04 });
  }
  return points;
}
