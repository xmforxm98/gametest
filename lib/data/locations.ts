import type { SceneId } from "@/types/game";

export type LocationInfo = {
  id: SceneId;
  label: string;
  description: string;
};

export const locations: LocationInfo[] = [
  {
    id: "dorm",
    label: "Dorm",
    description: "A spare room with a bed, a hot plate, and a single window.",
  },
  {
    id: "company",
    label: "Company",
    description: "Quiet cubicles, fluorescent light, and a hum of expectations.",
  },
  {
    id: "city",
    label: "City",
    description: "Neon alleys, rush-hour crowds, and a thousand quiet deals.",
  },
  {
    id: "cafe",
    label: "Cafe",
    description: "A dim cafe where regulars trade secrets for warmth.",
  },
  {
    id: "bar",
    label: "Bar",
    description: "Low music, late shifts, and conversations that lean closer.",
  },
];
