export interface MapThemeConfig {
  id: string;
  name: string;
  oceanBg: string;
  defaultLandFill: string;
  landStroke: string;
  strokeWidth: number;
  hoverLandFill: string;
  hoverStroke: string;
  selectedLandFill: string;
  selectedStroke: string;
  correctLandFill: string;
  errorLandFill: string;
  labelColor: string;
}

export const MAP_THEMES: Record<string, MapThemeConfig> = {
  slate: {
    id: 'slate',
    name: 'Modern Slate',
    oceanBg: '#090e17',
    defaultLandFill: '#1e293b',
    landStroke: '#334155',
    strokeWidth: 0.8,
    hoverLandFill: '#334155',
    hoverStroke: '#38bdf8',
    selectedLandFill: '#0284c7',
    selectedStroke: '#38bdf8',
    correctLandFill: '#059669',
    errorLandFill: '#dc2626',
    labelColor: '#94a3b8'
  },
  political: {
    id: 'political',
    name: 'Vibrant Political',
    oceanBg: '#0c1a2e',
    defaultLandFill: '#22354c',
    landStroke: '#475e7a',
    strokeWidth: 1,
    hoverLandFill: '#2d4766',
    hoverStroke: '#60a5fa',
    selectedLandFill: '#2563eb',
    selectedStroke: '#93c5fd',
    correctLandFill: '#10b981',
    errorLandFill: '#ef4444',
    labelColor: '#e2e8f0'
  },
  tactical: {
    id: 'tactical',
    name: 'Dark Tactical',
    oceanBg: '#030712',
    defaultLandFill: '#0f172a',
    landStroke: '#1e293b',
    strokeWidth: 1,
    hoverLandFill: '#1e293b',
    hoverStroke: '#06b6d4',
    selectedLandFill: '#0891b2',
    selectedStroke: '#22d3ee',
    correctLandFill: '#10b981',
    errorLandFill: '#f43f5e',
    labelColor: '#38bdf8'
  },
  parchment: {
    id: 'parchment',
    name: 'Vintage Parchment',
    oceanBg: '#f2e8d5',
    defaultLandFill: '#e5d3b6',
    landStroke: '#9c815e',
    strokeWidth: 0.9,
    hoverLandFill: '#d8c29d',
    hoverStroke: '#78350f',
    selectedLandFill: '#b45309',
    selectedStroke: '#78350f',
    correctLandFill: '#15803d',
    errorLandFill: '#b91c1c',
    labelColor: '#451a03'
  }
};
