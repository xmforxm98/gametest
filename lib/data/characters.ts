import type { CharacterId } from "@/types/game";

export type CharacterProfile = {
  id: CharacterId;
  name: string;
  role: string;
  signature: string;
};

export const characters: CharacterProfile[] = [
  {
    id: "ryo",
    name: "Ryo",
    role: "Night courier",
    signature: "quiet footsteps and a steady gaze",
  },
  {
    id: "jin",
    name: "Jin",
    role: "Cafe manager",
    signature: "soft laughter over clinking glass",
  },
  {
    id: "min",
    name: "Min",
    role: "City archivist",
    signature: "ink-stained hands and careful questions",
  },
];
