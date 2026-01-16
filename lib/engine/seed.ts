import type { ActionIntent, LogState, SceneId } from "@/types/game";

export type SeedContext = {
  dayIndex: number;
  playerId: string;
  scene: SceneId;
  intent: ActionIntent;
  logs: LogState;
};

const hashStringToSeed = (input: string): number => {
  let hash = 5381;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33) ^ input.charCodeAt(index);
  }
  return hash >>> 0;
};

export const createEventSeed = (context: SeedContext) => {
  const payload = JSON.stringify({
    dayIndex: context.dayIndex,
    playerId: context.playerId,
    scene: context.scene,
    intent: context.intent,
    logs: context.logs,
  });

  return {
    seed: hashStringToSeed(payload),
    payload,
  };
};
