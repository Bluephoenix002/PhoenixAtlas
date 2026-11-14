// In-Memory LRU GeoJSON Cache & Universal Fisher-Yates Shuffle
import { fetchWithOfflineCache } from './offlineSync';

// Fast in-memory TopoJSON -> GeoJSON FeatureCollection decoder
export function decodeTopoJSONToFeatureCollection(topo: any): any {
  if (!topo || topo.type !== 'Topology') return topo;
  const isQuantized = Boolean(topo.transform);
  const scaleX = topo.transform?.scale?.[0] ?? 1;
  const scaleY = topo.transform?.scale?.[1] ?? 1;
  const transX = topo.transform?.translate?.[0] ?? 0;
  const transY = topo.transform?.translate?.[1] ?? 0;

  const rawArcs: number[][][] = topo.arcs || [];
  const decodedArcs: number[][][] = rawArcs.map((arc) => {
    if (!isQuantized) {
      return arc.map((pt) => [Number(pt[0].toFixed(5)), Number(pt[1].toFixed(5))]);
    }
    let x = 0;
    let y = 0;
    return arc.map((pt) => {
      x += pt[0];
      y += pt[1];
      return [Number((x * scaleX + transX).toFixed(5)), Number((y * scaleY + transY).toFixed(5))];
    });
  });

  const decodeArcIndexes = (arcIdxs: number[]): number[][] => {
    const coords: number[][] = [];
    for (let i = 0; i < arcIdxs.length; i++) {
      const idx = arcIdxs[i];
      const arc = idx >= 0 ? decodedArcs[idx] : [...(decodedArcs[~idx] || [])].reverse();
      if (!arc) continue;
      for (let j = i > 0 ? 1 : 0; j < arc.length; j++) {
        coords.push(arc[j]);
      }
    }
    return coords;
  };

  const objKey = Object.keys(topo.objects || {})[0];
  const geomCol = objKey ? topo.objects[objKey] : null;
  const geometries: any[] = geomCol?.geometries || [];

  const features = geometries.map((g) => {
    const props = { ...(g.properties || {}) };
    if (!g.type) {
      return { type: 'Feature', properties: props, geometry: null };
    }
    if (g.type === 'Point') {
      const c = g.coordinates || [0, 0];
      return {
        type: 'Feature',
        properties: props,
        geometry: {
          type: 'Point',
          coordinates: [
            Number((c[0] * scaleX + transX).toFixed(5)),
            Number((c[1] * scaleY + transY).toFixed(5))
          ]
        }
      };
    }
    if (g.type === 'Polygon') {
      return {
        type: 'Feature',
        properties: props,
        geometry: {
          type: 'Polygon',
          coordinates: (g.arcs || []).map((ringArcs: number[]) => decodeArcIndexes(ringArcs))
        }
      };
    }
    if (g.type === 'MultiPolygon') {
      return {
        type: 'Feature',
        properties: props,
        geometry: {
          type: 'MultiPolygon',
          coordinates: (g.arcs || []).map((polyArcs: number[][]) =>
            polyArcs.map((ringArcs: number[]) => decodeArcIndexes(ringArcs))
          )
        }
      };
    }
    if (g.type === 'LineString') {
      return {
        type: 'Feature',
        properties: props,
        geometry: {
          type: 'LineString',
          coordinates: decodeArcIndexes(g.arcs || [])
        }
      };
    }
    if (g.type === 'MultiLineString') {
      return {
        type: 'Feature',
        properties: props,
        geometry: {
          type: 'MultiLineString',
          coordinates: (g.arcs || []).map((lineArcs: number[]) => decodeArcIndexes(lineArcs))
        }
      };
    }
    return {
      type: 'Feature',
      properties: props,
      geometry: { type: g.type, coordinates: g.coordinates }
    };
  });

  return {
    type: 'FeatureCollection',
    features
  };
}

class GeoJSONLRUCache {
  private cache = new Map<string, any>();
  private maxEntries: number;

  constructor(maxEntries = 6) {
    this.maxEntries = maxEntries;
  }

  public clearQuizGeoJSONs(): void {
    for (const key of Array.from(this.cache.keys())) {
      if (!key.includes('/maps/world/countries')) {
        this.cache.delete(key);
      }
    }
  }

  public async fetchGeoJSON(url: string): Promise<any> {
    if (this.cache.has(url)) {
      const val = this.cache.get(url);
      this.cache.delete(url);
      this.cache.set(url, val);
      return val;
    }

    let rawData: any = null;
    if (url.endsWith('.geojson')) {
      const topoUrl = url.replace(/\.geojson$/, '.topo.json');
      try {
        const topoRes = await fetchWithOfflineCache(topoUrl);
        if (topoRes.ok) {
          const ct = topoRes.headers.get('content-type') || '';
          if (!ct.includes('text/html')) {
            rawData = await topoRes.json();
          }
        }
      } catch {
        // Fallback to .geojson below
      }
    }

    if (!rawData) {
      const res = await fetchWithOfflineCache(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch GeoJSON: ${url}`);
      }
      rawData = await res.json();
    }

    const data =
      rawData?.type === 'Topology' ? decodeTopoJSONToFeatureCollection(rawData) : rawData;

    if (this.cache.size >= this.maxEntries) {
      for (const k of this.cache.keys()) {
        if (!k.includes('/maps/world/countries')) {
          this.cache.delete(k);
          break;
        }
      }
      if (this.cache.size >= this.maxEntries) {
        const oldestKey = this.cache.keys().next().value;
        if (oldestKey) this.cache.delete(oldestKey);
      }
    }
    this.cache.set(url, data);
    return data;
  }

  public has(url: string): boolean {
    return this.cache.has(url);
  }

  public clear() {
    this.cache.clear();
  }
}

export const geojsonCache = new GeoJSONLRUCache(6);

// Universal unbiased Fisher-Yates shuffle
export function fisherYatesShuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

// Seeded PRNG for Daily Challenge synchronization (Midnight UTC refresh)
export function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function seededShuffle<T>(array: T[], seed: number): T[] {
  const copy = [...array];
  const rand = seededRandom(seed);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}
